var map = document.getElementById('map');

gmap = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 44.969760, lng: -93.192814 },
    zoom: 10,
});

map.Map = gmap;

var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
var map = document.getElementById('map').Map;
var infowindow = new google.maps.InfoWindow();
var markers = [];
var selectedMarker = null;
var filteredLocations = [];

// Bias the SearchBox results towards current map's viewport.
google.maps.event.addListener(gmap, 'bounds_changed', function () {
    searchBox.setBounds(gmap.getBounds());

    markers.forEach(function (marker) {
        marker.setMap(null);
    });

    markers = [];

    data.forEach(function (dataItem) {
        if (gmap.getBounds().contains(new google.maps.LatLng(dataItem.lat, dataItem.long))) {
            var marker = new google.maps.Marker({
                map: gmap,
                position: new google.maps.LatLng(dataItem.lat, dataItem.long),
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            markers.push(marker);
        }
    });

    setFilteredLocations();
    refreshLocations();
});

// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
        return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }

        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    });
    gmap.fitBounds(bounds);

    markers.forEach(function (marker) {
        marker.setMap(null);
    });

    markers = [];

    data.forEach(function (dataItem) {
        if (bounds.contains(new google.maps.LatLng(dataItem.lat, dataItem.long))) {
            var marker = new google.maps.Marker({
                map: gmap,
                position: new google.maps.LatLng(dataItem.lat, dataItem.long),
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            markers.push(marker);
        }
    });
});

function setFilteredLocations()
{
    filteredLocations = [];
    var bounds = gmap.getBounds();
    data.forEach(function (dataItem) {
        if (bounds.contains(new google.maps.LatLng(dataItem.lat, dataItem.long))) {
            filteredLocations.push(dataItem);
        }
    });
}

function refreshLocations()
{
    document.getElementById('locations').innerHTML = "";
    console.log("Refreshed")
    for (var i = 0; i < 3 - 1; i++) {
        if (filteredLocations.length >= i + 1) {
            var dataItem = filteredLocations[i];

            var content = document.createElement("div");

            var school = document.createElement("div");

            var link = document.createElement("a");

            var schoolImage = document.createElement("img");

            var name = document.createElement("div");

            $(name).text(dataItem.name);

            $(link).attr('href', dataItem.url);
            $(schoolImage).attr('src', dataItem.featureImg);

            $(school).append(name);
            $(school).append(schoolImage);

            $(link).append(school);

            $(content).append(link);

            $(content).addClass('location-content');

            $(school).addClass('location-content-school');

            $('#locations').append(content);
        }
    }
}

function onchange(e) {

    infowindow.close();

    var selectedOption = list.selectedOptions[0];

    var id = $(selectedOption).val();

    var dataItem = data.filter(function (item) {
        return item.id == id;
    })[0];

    $('#featureImg').attr('src', dataItem.featureImg);
    $('#description').text(dataItem.description);

    map.setZoom(10);
    map.setCenter(new google.maps.LatLng(dataItem.lat, dataItem.long));
}