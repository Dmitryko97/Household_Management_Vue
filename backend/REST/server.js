let restify = require("restify");
let CookieParser = require('restify-cookies');

let server = restify.createServer();
server.use(CookieParser.parse);

const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['API-Token', 'sessionId'],
    exposeHeaders: ['API-Token-Expiry', 'sessionid']
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));

server.listen(9000, function(){
    console.log("STARTED rest server! :)");
});

module.exports = server;

