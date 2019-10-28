/**
#Author:    CronJ IT Technologies Private Limited
#Website:   www.cronj.com
#Title:     Uber-X
**/

let isDriver = true;
let faker = true;
let socket = io();

//Allows to locate user using Geolocation API firing a locationfound event with location data on success or a locationerror event on failure
map.locate({
    setView: true,
    maxZoom: 25,

});

//Events
map.on('locationfound', onLocationFound);
map.on('click', onMapClick)
map.on('zoomend', _changeLocateMaxZoom);

//Detects when map finishes zooming
function _changeLocateMaxZoom(e) {
    if (map._locateOptions) {
        map._locateOptions.maxZoom = map.getZoom();
    }
}

//Initialise fake driver first location 
function onLocationFound(e) {
    map.setZoom(19)
    mymarker = L.Marker.movingMarker([
        e.latlng,
        e.latlng
    ], 50, {
        icon: customerIcon,
        autostart: true,
        setZoom: 25
    }).addTo(map);

    socket.emit('init', {
        isDriver: isDriver,
        latLong: e.latlng
    });

}

//function to move the driver to the clicked position on the map.
function onMapClick(e) {
    if (faker == true) {

        let loc = mymarker.getLatLng();
        let latLong = e.latlng;
        let angle = setangle(loc.lat, loc.lng, latLong.lat, latLong.lng)
        mymarker.setIconAngle(angle);
        mymarker.moveTo([e.latlng.lat, e.latlng.lng], 5000)
        socket.emit('locChanged', {
            latLong: [e.latlng.lat, e.latlng.lng]
        });
    }
}

//set angle of the car marker for animation on the map
function setangle(slat, slong, dlat, dlong) {

    let dLon = (dlong - slong);
    let y = Math.sin(dLon) * Math.cos(dlat);
    let x = Math.cos(slat) * Math.sin(dlat) - Math.sin(slat) * Math.cos(dlat) * Math.cos(dLon);
    angle1 = Math.atan2(y, x);
    angle1 = (180 * angle1) / 3.1454;
    angle1 = (angle1 + 360) % 360;
    return angle1;
}

//function to return latlong 
function getLatLong(position) {
    return ([position.latitude, position.longitude])
}

socket.on('drivepath', function(id) {
    //drawing path from drivers location to customer location and showing it to the driver
    L.Routing.control({
        waypoints: [
            L.latLng(mymarker.getLatLng()),
            L.latLng(id.lat, id.lng)
        ],

        createMarker: function() {
            return null;
        }
    }).addTo(map);
});