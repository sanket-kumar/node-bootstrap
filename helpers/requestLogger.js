/**
 * Created by Sanket on 11/28/16.
 */
var url             = require('url');
var useragent       = require('useragent');
var winston         = require('winston');
var winstonRotate   = require('winston-daily-rotate-file');
var path            = require('path');
var Logger          = {};

Logger.options = {
    name        :   'node-bootstrap',
    filename    :   path.join(__dirname, '..', 'logs/request.log'),
    datePattern :   '.dd-MM-yyyy'
};
Logger.requestFormat = {
    'statusCode'    :   ':statusCode',
    'method'        :   ':method',
    'url'           :   ':url[pathname]',
    'responseTime'  :   ':responseTime ms',
    'ip'            :   ':ip',
    'userAgent'     :   ':userAgent',
    'data'          :   ':data',
    'response'      :   ':response'
};
Logger.winstonRotateObj = new winstonRotate(Logger.options);
Logger.transports       = [Logger.winstonRotateObj];
Logger.winstonLogger    = new winston.Logger({transports: Logger.transports});

Logger.create = function () {
    return function (req, res, next) {
        var logger = Logger.winstonLogger;
        var format = Logger.requestFormat;

        var requestEnd = res.end
            , requestedUrl = url.parse(req.originalUrl)
            , startTime = new Date();

        // Proxy the real end function
        res.end = function (chunk, encoding) {

            // Our format argument above contains key-value pairs for the output
            // object we send to Winston. Let's use this to format our results:
            var data = {};
            var tokens = {
                ':date': startTime.toISOString(),
                ':statusCode': res.statusCode,
                ':method': req.method,
                ':responseTime': (new Date() - startTime),
                ':url\\[([a-z]+)\\]': function (str, segment) { return requestedUrl[segment]; },
                ':ip': req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress,
                ':userAgent': useragent.parse(req.headers['user-agent']).toString(),
                ':data': JSON.stringify(req.body) || JSON.stringify(req.query),
                ':response' : chunk
            };

            // Do the work expected
            res.end = requestEnd;
            res.end(chunk, encoding);

            // Let's define a default format
            if (typeof(format) !== 'object') {
                format = {
                    date: ':date',
                    status: ':statusCode',
                    method: ':method',
                    url: ':url[pathname]',
                    response_time: ':responseTime',
                    user_agent: ':userAgent'
                };
            }

            // ... and replace our tokens!
            var replaceToken = function (str, match) { return tokens[token]; };
            for (var key in format) {
                data[key] = format[key];
                for (var token in tokens) {
                    data[key] = data[key].replace(new RegExp(token), typeof(tokens[token]) === 'function' ? tokens[token] : replaceToken);
                }
            }

            logger.info(data);
        };
        next();
    };
};

module.exports  = Logger;