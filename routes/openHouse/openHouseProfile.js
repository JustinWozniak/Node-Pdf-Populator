exports.openHouseProfile = function(req, res) {
  let userId = req.session.userId;
  // console.log(req.session.userId)
  // if (userId == null) {
  //   res.redirect("/openHouseProfile");
  //   return;
  // }

  let sql = "SELECT * FROM `openhouseusers` WHERE `id`='" + userId + "'";
  db.query(sql, function(err, result) {
    // console.log(userId)
    res.render("openHouseProfile", { data: result });
  });
};
