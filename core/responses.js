/**
 * Created by Sanket on 11/28/16.
 */
var logging           = require('../helpers/logging');
var constants         = require('./constants');
var responseFlags     = require('./responseFlags');
var responseMessages  = require('./responseMessages');

exports.sendResponse    = sendResponse;

function sendResponse(handlerInfo, res, response) {
    var respMessage;
    switch(response.status) {
        case 406:
            respMessage = {
                flag    :   responseFlags.ACTION_FAILED,
                message :   response.show_message ? response.message : responseMessages.SOMETHING_WENT_WRONG
            };
            logging.trace(handlerInfo, {RESPONSE : respMessage}, {ERROR : response.message}, {STATUS : response.status});
            res.send(respMessage);
            break;
        case 201:
            respMessage = {
                flag    :   responseFlags.ACTION_COMPLETE,
                message :   responseMessages.ACTION_COMPLETE
            };
            logging.trace(handlerInfo, {RESPONSE : respMessage});
            res.send(respMessage);
            break;
        case 200:
            logging.trace(handlerInfo, {RESPONSE : response});
            res.send(response);
            break;
        default:
            respMessage = {
                flag    :   responseFlags.ACTION_FAILED,
                message :   responseMessages.SOMETHING_WENT_WRONG
            };
            logging.error(handlerInfo, {RESPONSE : respMessage}, {ERROR : response.message}, {STATUS : response.status});
            res.send(respMessage);
            break;
    }
}