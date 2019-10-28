
let app = require('express')()
let server = require('http').createServer(app)
let io = require('socket.io')(server)
let md5 = require('md5');


let express = require("express"),
  routes = require("./routes"),
  http = require("http"),
  // server = require("http").Server,
  // io = require("socket.io")(http),
  // io = require('socket.io').listen(http);
  path = require("path"),
  forms = require("./routes/forms"),
  n4 = require("./routes/n4"),
  N4Download = require("./routes/n4"),
  officeUser = require("./routes/officeUser"),
  officeSignIn = require("./routes/officeSignIn"),
  openHouseSignUp = require("./routes/openHouse/openHouseSignUp"),
  openHouseSignIn = require("./routes/openHouse/openHouseSignIn"),
  openHouseDashboard = require("./routes/openHouse/openHouseDashboard"),
  openHouses = require("./routes/openHouse/openHouses"),
  openHouseProfile = require("./routes/openHouse/openHouseProfile"),
  agentDashboard = require("./routes/agents/agentDashboard"),
  openHouseMapView = require("./routes/openHouse/openHouseMapView"),
  agentSignIn = require("./routes/agents/agentSignIn"),
  agentSignUp = require("./routes/agents/agentSignUp"),
  agentFindCustomers = require("./routes/agents/agentFindCustomers");
  testingScreen = require("./routes/agents/testingScreen"),
  agentProfile = require("./routes/agents/agentProfile"),
  db = require("./util/database"),
  createN4Pdf = require("./routes/createN4Pdf"),
  session = require("express-session"),
  MySQLStore = require("express-mysql-session")(session);

//THESE ARE YOUR MIDDLEWARES

// let app = express();
let mysql = require("mysql");
let bodyParser = require("body-parser");
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "property pal"
});

connection.connect();

const store = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "",
  database: "property pal",
  collection: "sessions"
});



global.db = connection;
app.use(express.static(__dirname + "/public"));
// all environments
app.set("port", process.env.PORT || 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Felix The Cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
    store: store
  })
);

let drivers = {};
let service = {};
let bookid;


app.get("/", routes.index); 
app.get("/login", routes.index); 
app.post("/login", officeUser.login); 
app.get("/home/dashboard", officeUser.dashboard); 
app.get("/home/logout", officeUser.logout); 
app.get("/home/profile", officeUser.profile); 
app.get("/forms", forms.forms);
app.get("/n4", n4.n4); 
app.get("/BlankN4Form", n4.downloadN4);
app.get("/launchPdf", createN4Pdf.createN4Pdf); 
app.get("/officeSignup", officeUser.officeSignup);
app.post("/officeSignup", officeUser.officeSignup); 
app.get("/officeSignIn", officeSignIn.officeSignIn); 
app.get("/openHouseSignIn", openHouseSignIn.openHouseSignIn); 
app.get("/openHouseSignUp", openHouseSignUp.openHouseSignUp);
app.post("/openHouseSignUp", openHouseSignUp.openHouseSignUp); 
app.get("/openHouseMapView", openHouseMapView.openHouseMapView);
app.get("/openHouseDashboard", openHouseDashboard.openHouseDashboard); 
app.post("/openHouseDashboard", openHouseDashboard.openHouseDashboard); 
app.get("/openHouses", openHouses.openHouses); 
app.get("/openHouseProfile", openHouseProfile.openHouseProfile); 
app.get("/agentSignIn", agentSignIn.agentSignIn); 
app.get("/agentSignUp", agentSignUp.agentSignUp);
app.post("/agentSignUp", agentSignUp.agentSignUp); 
app.get("/agentDashboard", agentDashboard.agentDashboard); 
app.post("/agentDashboard", agentDashboard.agentDashboard); 
app.get("/agentProfile", agentProfile.agentProfile); 
app.get("/agentFindCustomers", agentFindCustomers.agentFindCustomers); 
app.get("/testingScreen", testingScreen.testingScreen); 




//io.on listens for connections initially when socket is created between server and client(customer/driver)
io.on("connection", function(socket) {
 
  console.log("Socket is on")

  socket.on("init", function(data) {

    //Init is one of our custom events which is fired when any of the driver comes online.
    if (data.isDriver) {
      console.log("HERdddR" + data.isDriver)
      drivers[socket.id] = {
        id: socket.id,
        latLong: data.latLong
      };
      socket.isDriver = data.isDriver;
      console.log("Driver Added at " + socket.id);
      socket.broadcast.to("customers").emit("driverAdded", drivers[socket.id]);
    } else {
      socket.join("customers");
      socket.emit("initDriverLoc", drivers);
    }
  });

  socket.on("initservice", function(data) {
    if (data.isservice) {
      console.log("HERER" + data.isservice)
      service[socket.id] = {
        id: socket.id,
        latLong: data.latLong
      }; console.log("service lat/long" + service.latLong)
      socket.isservice = data.isservice;
      console.log("Serviceman Added at " + socket.id);
      socket.broadcast
        .to("customers")
        .emit("servicemanAdded", service[socket.id]);
    } else {
      socket.join("customers");
      socket.emit("initservicerLoc", service);
    }
  });

  //book event is used to handle both Service and Cab booking
  socket.on("book", function(mymarker) {
    let near = 0,
      length,
      nr = 0;
    let at, id, key;
    let lat1 = mymarker.lat;
    let long1 = mymarker.lng;
    let lat2, long2;
    let details = {};
    if (mymarker[1] == 0) {
      at = Object.keys(drivers);
      id = at[0];
      length = Object.keys(drivers).length;
      if (length == 0) id = 0;
      else if (length == 1) {
        id = at[0];
      } else {
        for (key in at) {
          console.log("id=" + at[key]);
          lat2 = drivers[at[key]].latLong[0];
          long2 = drivers[at[key]].latLong[1];
          nr = distance(lat1, long1, lat2, long2);

          if (nr < near) {
            near = nr;
            id = key;
          }
        }
      }
    } else {
      at = Object.keys(service);
      id = at[0];
      length = Object.keys(service).length;
      if (length == 0) id = 0;
      else if (length == 1) {
        id = at[0];
      } else {
        for (key in at) {
          console.log("id=" + at[key]);
          lat2 = service[at[key]].latLong[0];
          long2 = service[at[key]].latLong[1];
          nr = distance(lat1, long1, lat2, long2);

          if (nr < near) {
            near = nr;
            id = key;
          }
        }
      }
    }
    details[0] = id; // id of booked car/service
    details[1] = mymarker[1]; //type 0 for cab or 1 for service
    socket.emit("bookid", details);
    if (bookid != id) {
      //To check if same service/cab booked twice
      if (details[1] == 0) socket.to(id).emit("drivepath", mymarker[0]);
      else socket.to(id).emit("servicepath", mymarker[0]);
    }
    bookid = id;
  });

  //locChanged is an event which is fired when the location of any driver changes
  socket.on("locChanged", function(data) {
    drivers[socket.id] = {
      id: socket.id,
      latLong: data.latLong
    };

    socket.broadcast.emit("driverLocChanged", {
      id: socket.id,
      latLong: data.latLong
    });
  });

  //servicelocChanged is similar to previous “locChanged”and perform similar update operation of service list
  socket.on("servicelocChanged", function(data) {
    service[socket.id] = {
      id: socket.id,
      latLong: data.latLong
    };

    socket.broadcast.emit("serviceLocChanged", {
      id: socket.id,
      latLong: data.latLong
    });
  });

  //disconnect listens to the event if any driver/serviceman/customer goes offline, updates the corresponding list and broadcast's it
  socket.on("disconnect", function() {
    if (socket.isDriver) {
      console.log("Driver disconnected at " + socket.id);
      socket.broadcast
        .to("customers")
        .emit("driverRemoved", drivers[socket.id]);
      delete drivers[socket.id];
    }
    if (socket.isservice) {
      console.log("Serviceman disconnected at " + socket.id);
      socket.broadcast
        .to("customers")
        .emit("serviceRemoved", service[socket.id]);
      delete service[socket.id];
    }
    if (!socket.isDriver && !socket.isservice) {
      console.log("Customer Disconnected at" + socket.id);
    }
  });
});

//distance” function finds out the nearest cab/serviceman from customer
function distance(lat1, lon1, lat2, lon2) {
  let p = 0.017453292519943295;
  let c = Math.cos;
  let a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a));
}




server.listen(8080)
// app.listen(8071);
