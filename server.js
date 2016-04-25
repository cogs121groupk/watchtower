//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var pg = require('pg');
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
              "community NOT LIKE 'UNKNOWN' limit 10000;"; 

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
      return res.json(result.rows);
    });
  });
  // return { delphidata: "No data present." }
});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
