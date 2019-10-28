const db = require("mysql-promise")();
const fs = require("fs");
const path = require("path");
db.configure({
  host: "localhost",
  user: "root",
  password: "",
  database: "property pal"
});

exports.n4 = function(req, res, next) {
  db.query("SELECT tenantsName FROM n4tenants")
    .then(function() {
      return db.query(
        "SELECT tenantsName FROM n4tenants ORDER by tenantsName asc"
      );
    })
    .spread(function(rows) {
      // console.log("Loook at all the tenants!!!", rows);

      res.render("n4", { data: rows });
    });
};

exports.downloadN4 = function(req, res) {
  const n4Name = "N4.pdf";
  const n4Path = path.join("public", n4Name);
  fs.readFile(n4Path, (err, data) => {
    if (err) {
      return next(err);
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=" + n4Name);
    res.send(data);
  });
};
