//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var pg = require('pg');
var Promise = require('bluebird');
var app = express();

//client id and client secret here, taken from .env (which you need to create)
dotenv.load();

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

//Configures the Template engine
app.engine('html', handlebars({ defaultLayout: 'layout', extname: '.html' }));
app.set("view engine", "html");
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat',
                  saveUninitialized: true,
                  resave: true}));

//set environment ports and start application
app.set('port', process.env.PORT || 3000);

//routes
app.get('/', function(req, res){
  res.render('index');
});

const query = "select charge_description, activity_date, block_address, community, zip " +
              "from cogs121_16_raw.arjis_crimes "+
              "where zip IS NOT NULL AND community IS NOT NULL AND " +
              "NULLIF(zip, '') IS NOT NULL AND NULLIF(community, '') IS NOT NULL AND " +
              "community NOT LIKE 'UNKNOWN' limit 1000;"; 

function fixAddr(addr){
  return addr.split('BLOCK').join('').split(' ').join('%20');
}

function getGeoData(count, result, data){
  return new Promise(function(resolve, reject){
      var dataRow = result.rows[count];
      dataRow.community = result.rows[count].community.split('BLOCK').join('');
      dataRow.block_address = result.rows[count].block_address.split('BLOCK').join('');
      const url = "http://nominatim.openstreetmap.org/search?format=json"+
                  "&state=CA&city="+fixAddr(dataRow.community)+
                  "&street="+fixAddr(dataRow.block_address)+
                  "&zip="+dataRow.zip;
      http.get(url, function (http_res) {
        // initialize the container for our data
        var rawData = "";

        // this event fires many times, each time collecting another piece of the response
        http_res.on("data", function (chunk) {
            // append this chunk to our growing `data` var
            rawData += chunk;
        });

        // this event fires *one* time, after all the `data` events/chunks have been gathered
        http_res.on("end", function () {
            // you can use res.send instead of console.log to output via express
            // console.log("done with promise: "+count);
            var tmp = JSON.parse(rawData);
            if(tmp.length != 0){
              dataRow['lat'] = tmp[0].lat;
              dataRow['lon'] = tmp[0].lon;
              data.push(dataRow);
              resolve(data);
            }else{
              resolve(tmp);
            }
        });
      });
  });
}

app.get('/delphidata', function (req, res) {
  var client = new pg.Client(conString);
  var data = [];
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query(query, function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      client.end();
      console.log("done");

      var promises = [];
      for(var i=0; i<result.rows.length/2; i++){
        promises.push(getGeoData(i,result,data));
      }

      Promise.all(promises).then(function(){
        return res.json(data);
      });

    });
  });

});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
