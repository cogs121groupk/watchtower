const crime_json = require("../crime_data.json");

exports.view = function(req, res) {
  res.render("index");
}

exports.getAllCrimeData = function (req, res) {
  res.json(crime_json);
}

exports.getTimeCrimeData = function(req, res){
	var time = req.query.time;
	var data = [];
	crime_json.forEach(function(crime){
		var date = new Date(crime.activity_date);
		if(date.getHours() == time){
			data.push(crime);
		}
	});
	res.json(data);
}