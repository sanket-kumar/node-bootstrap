/**
 * Created by Sanket on 11/28/16.
 */
var mysql = require('mysql');
var config=require('config').credentials;

var dbPoolConfig = {
    host: config.get('mysqlSettings.host'),
    user: config.get('mysqlSettings.user'),
    password: config.get('mysqlSettings.password'),
    database: config.get('mysqlSettings.database'),
    connectionLimit: config.get('mysqlSettings.connectionLimit')
};

var dbConnectionsPool = undefined;

function initializePool(){
    dbConnectionsPool = mysql.createPool(dbPoolConfig);
}

initializePool();

var dbClient = {
    executeQuery : function(sql, values, callback){

        var queryObject = {};

        if (typeof sql === 'object') {
            // query(options, cb)
            queryObject = sql;
            if (typeof values === 'function') {
                queryObject.callback = values;
            } else if (typeof values !== 'undefined') {
                queryObject.values = values;
            }
        } else if (typeof values === 'function') {
            // query(sql, cb)
            queryObject.sql      = sql;
            queryObject.values   = undefined;
            queryObject.callback = values;
        } else {
            // query(sql, values, cb)
            queryObject.sql      = sql;
            queryObject.values   = values;
            queryObject.callback = callback;
        }

        return dbConnectionsPool.query(queryObject.sql, queryObject.values, function(err, result){
            if(err){
                if(err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED'){
                    // Repeat the query being made if error code is ER_LOCK_DEADLOCK
                    process.stderr.write(err.code + ' OCCURRED\n');
                    process.stderr.write(err.code + ' ER_LOCK_DEADLOCK QUERY: ' + queryObject.sql + '\n');
                    process.stderr.write(err.code + ' ER_LOCK_DEADLOCK VALUES: ' + queryObject.values + '\n');
                    process.stderr.write(err.code + ' ER_LOCK_DEADLOCK CALLBACK: ' + queryObject.callback + '\n');
                    setTimeout(module.exports.dbHandler.getInstance().executeQuery.bind(null, sql, values, callback), 100);
                }
                else{
                    queryObject.callback(err, result);
                }
            }
            else{
                queryObject.callback(err, result);
            }
        });
    },

    executeTransaction : function(queries, values, callback){
    },

    escape : function(values){
        return dbConnectionsPool.escape(values);
    }
};

exports.dbHandler = (function (){

    var handler = null;

    return {
        getInstance : function (){
            if(!handler){
                handler = dbClient;
            }
            return handler;
        }
    };
})();
