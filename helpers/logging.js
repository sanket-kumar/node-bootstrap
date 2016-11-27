/**
 * Created by Sanket on 11/28/16.
 */

var levels = {
    trace : 0,
    debug : 1,
    info  : 2,
    warn  : 3,
    error : 4
};

var debuggingPermissions = {

    loggingEnabled      : true,
    defaultLoggingLevel : levels.trace,

    utils   :   {
        loggingEnabled      : true,
        defaultLoggingLevel : levels.trace,

        verifyDbConnection  : true
    }

};

exports.trace            = trace;
exports.debug            = debug;
exports.info             = info;
exports.warn             = warn;
exports.error            = error;
exports.logDatabaseQuery = logDatabaseQuery;
exports.logSendingEmail  = logSendingEmail;
exports.logFileWrite     = logFileWrite;
exports.logFileRead      = logFileRead;
exports.logRequest       = logRequest;
exports.logResponse      = logResponse;
exports.logErrorResponse = logErrorResponse;




// A variadic function to log the stuff
function log(loggingLevel, loggingParameters){
    var handlingInfo = loggingParameters[0];
    var apiModule    = handlingInfo.apiModule;
    var apiHandler   = handlingInfo.apiHandler;

    var defaultLoggingLevel = debuggingPermissions[apiModule].defaultLoggingLevel;

    if (loggingLevel !== levels.error && (!isLoggingEnabled(apiModule, apiHandler) || loggingLevel > defaultLoggingLevel)) {
        return;
    }

    var stream = process.stdout;
    if(loggingLevel === levels.error){
        stream = process.stderr;
    }

    for(var i = 1; i < loggingParameters.length; i++){
        stream.write(apiModule + ' ::: ' + apiHandler + ' ::: ' + JSON.stringify(loggingParameters[i]) + '\n');
    }
}


function trace(/* arguments */){
    log(levels.trace, arguments);
}

function debug(/* arguments */){
    log(levels.debug, arguments);
}

function info(/* arguments */){
    log(levels.info, arguments);
}

function warn(/* arguments */){
    log(levels.warn, arguments);
}

function error(/* arguments */){
    log(levels.error, arguments);
}

function logDatabaseQuery(handlerInfo, eventFired, error, result, query){
    if(error){
        if(typeof query !== 'undefined')
            module.exports.error(handlerInfo, {event : eventFired}, {error : error}, {result : result}, {query: query});
        else
            module.exports.error(handlerInfo, {event : eventFired}, {error : error}, {result : result});
    }
    else{
        if(typeof query !== 'undefined')
            module.exports.trace(handlerInfo, {event : eventFired}, {error : error}, {result : result}, {query: query});
        else
            module.exports.trace(handlerInfo, {event : eventFired}, {error : error}, {result : result});
    }
}

function logSendingEmail(handlerInfo, mailOptions, error, response){
    if(error){
        module.exports.error(handlerInfo, {MAILOPTIONS : mailOptions}, {ERROR : error}, {RESPONSE : response});
    }
    else{
        module.exports.trace(handlerInfo, {MAILOPTIONS : mailOptions}, {ERROR : error}, {RESPONSE : response});
    }
}

function logFileWrite(handlerInfo, filename, error){
    if(error){
        module.exports.error(handlerInfo, {FILENAME : filename}, {ERROR : error});
    }
    else{
        module.exports.trace(handlerInfo, {FILENAME : filename}, {ERROR : error});
    }
}

function logFileRead(handlerInfo, filename, error, data){
    if(error){
        module.exports.error(handlerInfo, {FILENAME : filename}, {ERROR : error});
    }
    else{
        module.exports.trace(handlerInfo, {FILENAME : filename}, {ERROR : error});
    }
}

function logRequest(handlerInfo, request){
    module.exports.trace(handlerInfo, {REQUEST : request});
}

function logResponse(handlerInfo, response){
    module.exports.trace(handlerInfo, {RESPONSE : response});
}

function logErrorResponse(handlerInfo, response){
    module.exports.error(handlerInfo, {RESPONSE : response});
}



function isLoggingEnabled(module, handler){
    // Check if the logging has been enabled
    if(!debuggingPermissions.loggingEnabled){
        return false;
    }

    // Check if the logging has been enabled for the complete module
    if (!debuggingPermissions[module].loggingEnabled){
        return false;
    }

    // Check if the logging has been enabled for the particular handler function for the module
    if (!debuggingPermissions[module][handler]){
        return false;
    }

    return true;
}
