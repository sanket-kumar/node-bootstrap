/**
 * Created by Sanket on 11/28/16.
 */
var mysqlHandler    = require('../helpers/mysqlConnector').dbHandler;
var logging         = require('../helpers/logging');
var responses       = require('./responses');
var testMongo       = require('./mongooseSchema/test');

exports.verifyDbConnection = verifyDbConnection;

function verifyDbConnection(req, res) {
    var handlerInfo = {
        apiModule  : 'utils',
        apiHandler : 'verifyDbConnection'
    };
    logging.trace(handlerInfo, {request : req.body});

    var sqlStatement = 'SELECT 1 from DUAL WHERE 1 =1';
    var query = mysqlHandler.getInstance().executeQuery(sqlStatement, [], function(err, result) {
        logging.logDatabaseQuery(handlerInfo, 'Verifying mysql database connection', err, result, query.sql);
        if(err) {
            err.status = 406;
            return responses.sendResponse(handlerInfo, res, err);
        }
        testMongo.
        find({
            id : 1
        }).
        select({
            id : 1
        }).
        exec(function(err, result) {
            logging.logDatabaseQuery(handlerInfo, "Verifying mongo DB connection", err, result);
            if(err) {
                err.status = 406;
                return responses.sendResponse(handlerInfo, res, err);
            }
            return responses.sendResponse(handlerInfo, res, {status : 201});
        });

    })
}