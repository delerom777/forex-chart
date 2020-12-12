'use strict';

var Tick = require('../models/Tick.js');


function index(req, res, config) {
    Tick.find({}).select('created_at date bid -_id').sort({
        'date': 1
    }).exec(function (err, ticks) {
        if (err) return next(err);
        var json = ticks;
 
        res.template('index.ejs', {
            title: 'Forex chart',
            chart: JSON.stringify(json)
        });
    });
}

//var getBalance = (function() {
//    Tick.aggregate([
//        { "$group": {
//            "_id": {
//              "$toDate": {
//                "$subtract": [
//                  { "$toLong": "$created_at" },
//                  { "$mod": [ { "$toLong": "$created_at" }, 1000 * 60 * 15 ] }
//                ]
//              }
//            },
//            last_bid: {$last: "$bid"},
//            last_date: {$last: "$created_at"},
//            count: { "$sum": 1 }
//        }},
//        {
//            $sort: {
//              _id: 1
//            }
//        }
//    ], function (err, result) {
//        if (err) {
//            console.log(err);
//            return;
//        }
//        console.log(JSON.stringify(result));
//    });
//}())

//function index(req, res, config) {
//    Tick.aggregate([
//        { "$group": {
//            "_id": {
//              "$toDate": {
//                "$subtract": [
//                  { "$toLong": "$created_at" },
//                  { "$mod": [ { "$toLong": "$created_at" }, 1000 * 60 * 15 ] }
//                ]
//              }
//            },
//            last_bid: {$last: "$bid"},
//            last_date: {$last: "$created_at"},
//            count: { "$sum": 1 }
//        }},
//        {
//            $sort: {
//              _id: 1
//            }
//        }
//    ]).exec(function (err, ticks) {
//        if (err) return next(err);
//        // chart JSON data
//
//        res.template('index.ejs', {
//            title: 'Anychart NodeJS demo',
//            chart: JSON.stringify(ticks)
//        });
//    });
//}



module.exports = index;