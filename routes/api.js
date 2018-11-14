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
      if (Array.isArray(req.query.stock)) {
        const stockData1 = await stock.getStockData(req.query.stock[0], req.query.like, req.ip);
        const stockData2 = await stock.getStockData(req.query.stock[1], req.query.like, req.ip);
        const likes1 = stockData1.likes;
        stockData1.likes = likes1 - stockData2.likes;
        stockData2.likes = stockData2.likes - likes1;
        res.send({ stockData: [ stockData1, stockData2 ]});
      } else {
        res.send({ stockData: await stock.getStockData(req.query.stock, req.query.like, req.ip) });
      }
    });
};