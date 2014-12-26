
/**
 * Module dependencies.
 */

var azure = require('azure-storage');
var nconf = require('nconf');
nconf.env().file({ file: 'config.json' });

var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");


var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

require('./dateFormat.js');

// app.set('view options', { debug: true })
var ObservationList = require('./routes/ObservationList.js');
var Observation = require('./models/Observation.js');
var observation = new Observation(azure.createTableService(accountName, accountKey), tableName, partitionKey);
var observationList = new ObservationList(observation);

app.get('/', routes.index);
app.get('/temperature', observationList.showObservations.bind(observationList));
app.get('/about', routes.about);
app.get('/contact', routes.contact);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
