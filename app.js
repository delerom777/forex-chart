var express = require('express');
var path = require('path');
var app = require('http').createServer(handler);
var io = require('socket.io');
var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
var ForgeClient = require("forex-quotes").default;


var ErrorPage = require('error-page');
var Templar = require('templar');
var router = require('routes')();
var TickModel = require('./models/Tick.js');
var last;

 
// set MongoDB connection
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/chartnew');
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));

// template setting
var environment = 'development';
var config = require('./config/' + environment + '.js');
var templarOptions = {
    engine: config.engine,
    folder: config.templates
};
Templar.loadFolder(config.templates);

// set routes
router.addRoute('/*', require('./routes/static.js'));
router.addRoute('/', require('./routes/index.js'));


// Request
let client = new ForgeClient('lNrc0cTOZth3xpwV8BfflfGmXuZKSvYm');


client.getQuotes(['EURUSD']).then(response => {
      bodyChunk = response.toString();
      setInterval(function () {
        if (bodyChunk !== last) {
                var post = new TickModel({
                    bid: response[0].bid,
                    ask: response[0].ask,
                    clsbid: response[0].bid,
                    clsask: response[0].ask,
                    name: response[0].symbol,
                    value: response[0].price
                });
                var x = (new Date()).getTime(), // current time
                    y = Number(response[0].price);

                    io_server.emit('update', {
                        x: x,
                        y: y
                    });
                    console.info("emitted: [" + x + "," + y + "]");
                post.save(function (err) {
                    if (err) {
                        return err;
                    } else {
                        console.log("Tick save");
                    }
                });
            last = bodyChunk;
        }
      }, 1000);
});
//
//var request = https.request(options, function (response) {
//    response.on("data", function (chunk) {
//        bodyChunk = chunk.toString();
//        
//        setInterval(function () {
//        if (bodyChunk !== last) {
//            var tickdata = JSON.parse(bodyChunk);
//                var post = new TickModel({
//                    bid: tickdata.bid,
//                    ask: tickdata.ask,
//                    clsbid: tickdata.bid,
//                    clsask: tickdata.ask,
//                    name: tickdata.symbol,
//                    value: tickdata.price
//                });
//                var x = (new Date()).getTime(), // current time
//                    y = Number(tickdata.bids[0].price);
//
//                    io_server.emit('update', {
//                        x: x,
//                        y: y
//                    });
//                    console.info("emitted: [" + x + "," + y + "]");
//                post.save(function (err) {
//                    if (err) {
//                        return err;
//                    } else {
//                        console.log("Tick save");
//                    }
//                });
//            last = bodyChunk;
//        }
//    }, 0.001);
//    });
//    response.on("end", function (chunk) {
//        console.log("Error connecting to OANDA HTTP Rates Server");
//        console.log("HTTP - " + response.statusCode);
//        console.log(bodyChunk);
//        process.exit(1);
//    });
//});
//
//request.end();

// set server
var server = http.createServer(handler);
var io_server = io(server);
io_server.on('connection', function (client) {
    console.log("connect: " + client);
    client.on('event', function (data) {
        console.log("data: " + data);
    });
    client.on('disconnect', function () {
        console.log(("disconnect"))
    });
});

function handler(req, res) {
    res.error = ErrorPage(req, res, {
        404: 'not found!'
    });
    res.template = Templar(req, res, templarOptions);
    router.match(req.url).fn(req, res, config);
}
server.listen(3000);


console.log('Server Listening - http://localhost:' + config.port + '. ' + environment + ' environment');
module.exports = server;