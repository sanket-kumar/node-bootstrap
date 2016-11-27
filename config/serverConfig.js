/**
 * Created by Sanket on 11/28/16.
 */
exports.credentials = {
    "httpPort": process.env.HTTP_PORT,

    "mysqlSettings"   : {
        "host"    : process.env.MYSQL_DATABASE_HOST,
        "user"    : process.env.MYSQL_DATABASE_USER,
        "password": process.env.MYSQL_DATABASE_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "connectionLimit" : process.env.MYSQL_DATABASE_CONNECTION_LIMIT
    },

    "mongoSettings"     : {
        "mongoUrl"        : "mongodb://" + process.env.MONGO_DATABASE_HOST + '/' + process.env.MONGO_DATABASE,
        "user"            : process.env.MONGO_DATABASE_USER,
        "password"        : process.env.MONGO_DATABASE_PASSWORD,
        "connectionLimit" : process.env.MONGO_DATABASE_CONNECTION_LIMIT,
        "retryCount"      : 5
    }

};