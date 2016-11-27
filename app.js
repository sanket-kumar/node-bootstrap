/**
 * Created by Sanket on 11/28/16.
 */
var env             = require('node-env-file');
var express         = require('express');
var http            = require('http');
var https           = require('https');
var path            = require('path');
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var fs              = require('fs');
env(__dirname + '/config/.env', {overwrite: true}); // Loading environment file into process.env
try {
    require('./helpers/envValidator.js'); // Validating environment variables
} catch(e) {
    console.log("\x1b[32mUnable to start server :: \x1b[31m", e.message, "\x1b[0m");
    return;
}

process.env.NODE_CONFIG_DIR = __dirname + '/config/';
config = require('config').credentials;

var app     = express();
// set up the port number
app.set('port', config.get('httpPort'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Our custom request logger
var requestLogger   = require('./helpers/requestLogger.js');
app.use(requestLogger.create());
// Database connection
var mysqlHandler    = require('./helpers/mysqlConnector');
var mongohandler    = require('./helpers/mongoConnector');
var utils           = require('./core/utils');

// API Endpoints
app.get('/v1/verify_db_connection',     utils.verifyDbConnection);

// Server Start
var httpServer = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
process.on("message", function(message){
    console.log("Received signal : " + message);
    if (message === 'shutdown') {
        httpServer.close();
        setTimeout(function(){
            process.exit(0);
        }, 15000);
    }
});
