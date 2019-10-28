exports.agentProfile = function(req, res) {
  // console.log("AHHHHH" + req.session.userId)
    let userId = req.session.userId;
    // if (userId == null) {
    //   res.redirect("/openHouseProfile");
    //   return;
    // }
  
    let sql = "SELECT * FROM `agentusers` WHERE `id`='" + userId + "'";
    db.query(sql, function(err, result) {
      res.render("agentProfile", { data: result });
    });
  };
  