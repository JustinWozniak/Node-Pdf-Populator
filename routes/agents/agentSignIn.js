exports.agentSignIn = function(req, res) {
    let message = "";
    let sess = req.session;
    // console.log("SESSION = " + JSON.stringify(req.session))
    if (req.method == "POST") {
      let post = req.body;
      let name = post.user_name;
      let pass = post.password;
  
      let sql =
        "SELECT id, first_name, last_name, user_name FROM `agentusers` WHERE `user_name`='" +
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
          res.render("agentSignIn", { message: message },{userId:req.session.user});
        }
      });
    } else {
      res.render("agentSignIn", { message: message });
    }
  
  };
  