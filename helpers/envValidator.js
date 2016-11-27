/**
 * Created by Sanket on 11/28/16.
 */
var fs  = require('fs');
var dir = __dirname + '/../logs';

function validateFolder() {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

function validateEnvironmentVariables() {
    validateFolder();
    var validationArray = ['NODE_ENV', 'HTTP_PORT', 'MYSQL_DATABASE_HOST', 'MYSQL_DATABASE_USER'
        , 'MYSQL_DATABASE_PASSWORD', 'MYSQL_DATABASE', 'MYSQL_DATABASE_CONNECTION_LIMIT', 'MONGO_DATABASE_HOST'
        , 'MONGO_DATABASE_CONNECTION_LIMIT', 'MONGO_DATABASE'];

    for(var i=0; i<validationArray.length; i++) {
        if(!process.env[validationArray[i]]) {
            throw new Error("Environment data missing for " + validationArray[i]);
        }
    }
}

validateEnvironmentVariables();