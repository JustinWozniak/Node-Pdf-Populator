const db = require("mysql-promise")();

db.configure({
  host: "localhost",
  user: "root",
  password: "",
  database: "property pal"
});


exports.openHouses = function(req, res) {
    let message = "";


  db.query("SELECT * FROM openhouses")
    .then(function() {
      return db.query("SELECT * FROM openhouses");
    })
    .spread(function(rows) {
      // console.log("Loook at all the houses!", rows);


      res.render("openHouses", { message: message, data: rows });
      return
    });
};

