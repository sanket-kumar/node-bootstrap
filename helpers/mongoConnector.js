/**
 * Created by Sanket on 11/28/16.
 */
var mongoose        = require('mongoose');
var mongoSettings   = config.get("mongoSettings");
var options = {
    server: {
        poolSize: mongoSettings.connectionLimit,
        reconnectTries: mongoSettings.retryCount,
        socketOptions: {
            keepAlive: 1
        }
    }
};

if(mongoSettings.user) {
    options.user = mongoSettings.user;
}
if(mongoSettings.password) {
    options.pass = mongoSettings.password;
}
var mongoUrl = mongoSettings.mongoUrl;
mongoose.connection = mongoose.createConnection(mongoUrl, options);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose Connected Successfully!! ');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

module.exports = mongoose;