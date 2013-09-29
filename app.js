/** 
 * ~/app.js
 * --------
 */ 


var express     = require("express");
var app         = express();
var nodemailer  = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var dbPath      = 'mongodb://localhost/node_bpt';
var fs = require('fs'); 

// Import the data layer
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};

// Import the models
var models = {
  Account: require('./models/Account')(config, mongoose, nodemailer)
};

app.configure(function(){
  app.sessionSecret = '1mancake'; 
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: app.sessionSecret,
    key: 'express.sid', 
    store: new MemoryStore()
  }));
  mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
  });
});


fs.readdirSync('routes').forEach(function(file){
    if( file[0] == '.' ){ 
	return; 
    }
    var routeName = file.substr(0, file.indexOf('.')); 
    require('./routes/' + routeName)(app, models); 
}); 


app.get('/', function(req, res){
  res.render('index.jade');
});


app.post('/contacts/find', function(req, res) {
  var searchStr = req.param('searchStr', null);
  if ( null == searchStr ) {
    res.send(400);
    return;
  }

  models.Account.findByString(searchStr, function onSearchDone(err,accounts) {
    if (err || accounts.length == 0) {
      res.send(404);
    } else {
      res.send(accounts);
    }
  });
});

app.listen(8080);
console.log("SocialNet is listening to port 8080.");
