//---------------------------------------------signup page call------------------------------------------------------
exports.openHouseSignUp = function(req, res) {
  message = "";
  if (req.method == "POST") {
    let md5 = require('md5');
    let post = req.body;
    let name = post.user_name;
    let pass = md5(post.password);
    let fname = post.first_name;
    let lname = post.last_name;
    let mob = post.mob_num;
    let sql =
      "INSERT INTO `openhouseusers`(`first_name`,`last_name`,`mob_num`,`user_name`, `password`) VALUES ('" +
      fname +
      "','" +
      lname +
      "','" +
      mob +
      "','" +
      name +
      "','" +
      pass +
      "')";

    let query = db.query(sql, function(err, result) {
      message = "Success! Your account has been created. You can now sign in";
      res.render("openHouseSignUp", { message: message });
    });
  } else {
    res.render("openHouseSignUp");
  }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.openHouseLogin = function(req, res) {
  let message = "";
  let sess = req.session;

  if (req.method == "POST") {
    let post = req.body;
    let name = post.user_name;
    let pass = post.password;

    let sql =
      "SELECT id, first_name, last_name, user_name FROM `openhouseusers` WHERE `user_name`='" +
      name +
      "' and password = '" +
      pass +
      "'";
    db.query(sql, function(err, results) {
      if (results.length) {
        req.session.userId = results[0].id;
        req.session.user = results[0];
        res.redirect("/home/dashboard");
      } else {
        message = "Wrong Credentials. Please try again...";
        res.render("openHouseSignIn.ejs", { message: message });
      }
    });
  } else {
    res.render("openHouseSignIn", { message: message });
  }
};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.openHouseDashboard = function(req, res, next) {
  let user = req.session.user,
    userId = req.session.userId;
  if (userId == null) {
    res.redirect("/openHouseSignIn");
    return;
  }

  let sql = "SELECT * FROM `openhouseusers` WHERE `id`='" + userId + "'";

  db.query(sql, function(err, results) {
    res.render("dashboard", { user: user });
  });
};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/");
  });
};
