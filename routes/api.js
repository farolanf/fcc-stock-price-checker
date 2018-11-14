/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var { Stock } = require('../models');

module.exports = function (app, db) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const stock = new Stock(db);
      res.send({ stockData: await stock.getStockData(req.query.stock, req.query.like, req.ip) });
    });
};