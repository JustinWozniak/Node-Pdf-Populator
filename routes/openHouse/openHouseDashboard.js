exports.openHouseDashboard = function(req, res) {
  let message = "";
  res.render("openHouseDashboard", { message: message });
  return;
};
