/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      res.send({ 
        stockData: {
          stock: req.query.stock
        } 
      });
    });
    
};
