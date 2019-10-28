let isDriver = false;
let isHouse = true;
let markers = {};
let inited = false;
let socket = io();
let isservice = false;
let send = {};
let key, eta, bookid;

//Allows to locate user using Geolocation API firing a locationfound event with location data on success or a locationerror event on failure
map.locate({
  maxZoom: 15,
  watch: true, //starts continuous watching of location changes of customer
  enableHighAccuracy: true
});

map.on("locationfound", success);
map.on("zoomend", _changeLocateMaxZoom);

//detects when map finishes zooming
function _changeLocateMaxZoom(e) {
  if (map._locateOptions) {
    map._locateOptions.maxZoom = map.getZoom();
  }
}

//initialise driver first location
function init(position) {
  latLong = getLatLong(position);
  map.setView(latLong, 15);
  mymarker = L.Marker.movingMarker([latLong, latLong], 0, {
    autostart: true,
    zoom: 15,
    icon: clientIcon
  }).addTo(map);

  socket.emit("init", {
    isDriver: isDriver,
    latLong: latLong
  });

  socket.emit("initservice", {
    isservice: isservice,
    latLong: latLong
  });
  inited = true;
}

// ===========================================================================




//initialise open houses location
function init(position) {
  position.latitude = 43.445023;
  position.longitude = -80.556259;

  latLong = getLatLong(position);

  map.setView(latLong, 10);
  mymarker = L.Marker.movingMarker([latLong, latLong], 0, {
    autostart: true,
    zoom: 40,
    icon: openHouse
  }).addTo(map);

  socket.emit("init", {
    isDriver: isDriver,
    latLong: latLong
  });

  socket.emit("initservice", {
    isservice: isservice,
    latLong: latLong
  });

  inited = false;
  mymarker
    .bindPopup(
      "<b>Open House!</b><br>513-499 Thorndale Dr<br>Waterloo Ont <br><a href='https://www.kwproperty.com/listing.asp?id=1804'>View</a></li>"
    )
    .openPopup();

  position.latitude = 43.139944;
  position.longitude = -80.268302;

  latLong = getLatLong(position);

  map.setView(latLong, 10);
  mymarker1 = L.Marker.movingMarker([latLong, latLong], 0, {
    autostart: true,
    zoom: 40,
    icon: openHouse
  }).addTo(map);

  socket.emit("init", {
    isDriver: isDriver,
    latLong: latLong
  });

  socket.emit("initservice", {
    isservice: isservice,
    latLong: latLong
  });

  inited = false;
  mymarker1
    .bindPopup(
      "<b>Open House!</b><br>29-31 Bridge St<br>Brantford Ont <br><a href='https://www.kwproperty.com/listing.asp?id=594'>View</a></li>"
    )
    .openPopup();

  position.latitude = 43.441211;
  position.longitude = -80.451103;

  latLong = getLatLong(position);

  map.setView(latLong, 10);
  mymarker2 = L.Marker.movingMarker([latLong, latLong], 0, {
    autostart: true,
    zoom: 40,
    icon: openHouse
  }).addTo(map);

  socket.emit("init", {
    isDriver: isDriver,
    latLong: latLong
  });

  socket.emit("initservice", {
    isservice: isservice,
    latLong: latLong
  });

  inited = false;
  mymarker2
    .bindPopup(
      "<b>Open House!</b><br>116 Kenneth Ave<br>Kitchener Ont <br><a href='https://www.kwproperty.com/listing.asp?id=1803 '>View</a></li>"
    )
    .openPopup();

  position.latitude = 43.456006;
  position.longitude = -80.506562;

  latLong = getLatLong(position);

  map.setView(latLong, 10);
  mymarker3 = L.Marker.movingMarker([latLong, latLong], 0, {
    autostart: true,
    zoom: 40,
    icon: openHouse
  }).addTo(map);

  socket.emit("init", {
    isDriver: isDriver,
    latLong: latLong
  });

  socket.emit("initservice", {
    isservice: isservice,
    latLong: latLong
  });

  inited = false;
  mymarker3
    .bindPopup(
      "<b>Open House!</b><br>742 King St W <br>Kitchener Ont <br><a href='https://www.kwproperty.com/listing.asp?id=693&searching=true'>View</a></li>"
    )
    .openPopup();

  position.latitude = 43.457777;
  position.longitude = -80.494011;

  latLong = getLatLong(position);

  map.setView(latLong, 10);
  mymarker4 = L.Marker.movingMarker([latLong, latLong], 0, {
    autostart: true,
    zoom: 40,
    icon: openHouse
  }).addTo(map);

  socket.emit("init", {
    isDriver: isDriver,
    latLong: latLong
  });

  socket.emit("initservice", {
    isservice: isservice,
    latLong: latLong
  });

  inited = false;
  mymarker4
    .bindPopup(
      "<b>Open House!</b><br>3-186 Wellington St <br>Kitchener Ont <br><a href='https://www.kwproperty.com/listing.asp?id=1212&searching=true'>View</a></li>"
    )
    .openPopup();

  position.latitude = 43.357806;
  position.longitude = -80.306078;

  latLong = getLatLong(position);

  map.setView(latLong, 10);
  mymarker5 = L.Marker.movingMarker([latLong, latLong], 0, {
    autostart: true,
    zoom: 40,
    icon: openHouse
  }).addTo(map);

  socket.emit("init", {
    isDriver: isDriver,
    latLong: latLong
  });

  socket.emit("initservice", {
    isservice: isservice,
    latLong: latLong
  });

  inited = false;
  mymarker5
    .bindPopup(
      "<b>Open House!</b><br>11 Pollock Ave <br>Cambridge, ON <br><a href='https://www.kwproperty.com/listing.asp?id=1212&searching=true'>View</a></li>"
    )
    .openPopup();
}

//========================================================================

//function executes for location found event
function success(pos) {
  if (!inited) init(pos);
  else mymarker.moveTo(getLatLong(pos), 5000);
}

function getLatLong(position) {
  console.log(position);
  return [position.latitude, position.longitude];
}

//Event listener to initialise driver first location and push it to markers object
socket.on("initDriverLoc", function(drivers) {
  //iterate through all drivers
  _.each(drivers, function(driver) {
    markers[driver.id] = L.Marker.movingMarker(
      [driver.latLong, driver.latLong],
      [0],
      {
        icon: customerIcon,
        autostart: true,
        zoom: 15
      }
    ).addTo(map); //Add all drivers to the customer's map
  });
});

socket.on("initservicerLoc", function(drivers) {
  _.each(drivers, function(driver) {
    markers[driver.id] = L.Marker.movingMarker(
      [driver.latLong, driver.latLong],
      [0],
      {
        icon: serviceIcon,
        autostart: true,
        zoom: 15
      }
    ).addTo(map);
  });
});

//Event listener fired when any new driver comes online, it is pushed into markers object and added to the customer's map
socket.on("driverAdded", function(driver) {
  console.log("New driver joined." + driver);
  markers[driver.id] = L.Marker.movingMarker(
    [driver.latLong, driver.latLong],
    [0],
    {
      icon: customerIcon,
      autostart: true,
      zoom: 15
    }
  ).addTo(map);
});

//Event listener fired when any new serviceman comes online, it is pushed into markers and added to the customer's map
socket.on("servicemanAdded", function(driver) {
  console.log("New driver joined.");
  markers[driver.id] = L.Marker.movingMarker(
    [driver.latLong, driver.latLong],
    [0],
    {
      icon: serviceIcon,
      autostart: true,
      zoom: 15
    }
  ).addTo(map);
});

//event is fired when any driver goes offline
socket.on("driverRemoved", function(driver) {
  console.log("driver left." + driver);
  map.removeLayer(markers[driver.id]); //driver icon removed from customer's map
});

//event is fired when any serviceman goes offline
socket.on("serviceRemoved", function(serviceman) {
  console.log("driver left.");
  map.removeLayer(markers[serviceman.id]); ////serviceman icon removed from customer's map
});

//event is fired when location of driver changes,if changed then animate the change on the customer's map with proper direction and angle
socket.on("driverLocChanged", function(data) {
  let loc = markers[data.id].getLatLng();
  let angle = setangle(loc.lat, loc.lng, data.latLong[0], data.latLong[1]);
  markers[data.id].setIconAngle(angle);
  markers[data.id].moveTo(data.latLong, 5000);
});

//event is fired when location of serviceman changes,if changed then animate the change on the customer's map with proper direction
socket.on("serviceLocChanged", function(data) {
  let loc = markers[data.id].getLatLng();
  let angle = setangle(loc.lat, loc.lng, data.latLong[0], data.latLong[1]);
  markers[data.id].moveTo(data.latLong, 5000);
});

function nearby(data) {
  send[0] = mymarker.getLatLng();
  send[1] = data;
  // console.log('send[0]=' + send[0] + 'send[1]=' + send[1])
  socket.emit("book", send);
}

socket.on("bookid", function(id) {
  // console.log("id = " + id)
  //To check booking of same cab again
  if (bookid == id[0]) confirm("You cannot book same service again");
  else {
    if (id[0] == 0) confirm("Not available" + id[0] + " = " + id[0]);
    else {
      let time = L.Routing.control({
        waypoints: [
          L.latLng(mymarker.getLatLng()),
          L.latLng(markers[id[0]].getLatLng())
        ]
      });
      if (id[1] == 0) confirm("Your open house has been booked with: " + id[0]);
      if (id[1] == 1) confirm("Your Service has been booked with " + id[1]);

      for (key in markers) {
        if (markers[id[0]].getLatLng() != markers[key].getLatLng())
          map.removeLayer(markers[key]);
      }
      setTimeout(function() {
        console.log("time is" + time);
        eta = Math.round(time._routes[0].summary.totalTime / 60);
        if (eta == 0)
          //if time rounds off to 0 minutes
          eta++;
        markers[id[0]].bindPopup(eta + " Minutes away ").openPopup();
      }, 2000);
    }
    bookid = id[0];
  }
});

//if user is not located using geolocation api,throws respective error message
function error(err) {
  console.log("ERROR " + err.message);
  confirm("ERROR " + err.message);
}

//set angle of the car marker for animation on the map
function setangle(slat, slong, dlat, dlong) {
  let y = Math.sin(dlong - slong) * Math.cos(dlat);
  let x =
    Math.cos(slat) * Math.sin(dlat) -
    Math.sin(slat) * Math.cos(dlat) * Math.cos(dlong - slong);
  angle1 = Math.atan2(y, x);
  angle1 = (180 * angle1) / Math.PI;
  return angle1;
}

//function to return latlong
function getLatLong(position) {
  return [position.latitude, position.longitude];
}
