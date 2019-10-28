//---------------------------------------------signup page call------------------------------------------------------
exports.officeSignup = function(req, res) {
  message = "";
  if (req.method == "POST") {
    let md5 = require('md5');
    let post = req.body;
    let name = post.user_name;
    let pass = md5(post.password);
    let fname = post.first_name;
    let lname = post.last_name;
    let mob = post.mob_no;

    let sql =
      "INSERT INTO `officeusers`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" +
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
      res.render("officeSignup", { message: message });
    });
  } else {
    res.render("officeSignup");
  }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res) {
  let message = "";
  let sess = req.session;

  if (req.method == "POST") {
    let md5 = require('md5');
    let post = req.body;
    let name = post.user_name;
    let pass = md5(post.password);
    // console.log(pass)
    let sql =
      "SELECT id, first_name, last_name, user_name FROM `officeusers` WHERE `user_name`='" +
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
        res.render("officeSignIn.ejs", { message: message });
      }
    });
  } else {
    res.render("officeSignIn", { message: message });
  }
};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function(req, res, next) {
  let user = req.session.user,
    userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  let sql = "SELECT * FROM `officeusers` WHERE `id`='" + userId + "'";

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
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res) {
  let userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  let sql = "SELECT * FROM `officeusers` WHERE `id`='" + userId + "'";
  db.query(sql, function(err, result) {
    res.render("profile", { data: result });
  });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile = function(req, res) {
  let userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  let sql = "SELECT * FROM `officeusers` WHERE `id`='" + userId + "'";
  db.query(sql, function(err, results) {
    res.render("edit_profile", { data: results });
  });
};
