const db = require("mysql-promise")();
var unique = require('uniq');

db.configure({
  host: "localhost",
  user: "root",
  password: "",
  database: "property pal"
});


exports.openHouseMapView = function(req, res) {
    let message = "";

    db.query("SELECT * FROM openhouses")
    .then(function() {
      return db.query("SELECT * FROM openhouses");
    })
    .spread(function(rows) {
      // console.log("Loook at all the houses!", rows);


    res.render("openHouseMapView", { message: message, data: rows });
    return;
  });
  
}



