/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var axios = require('axios');

const avKey = process.env.ALPHAVANTAGE_APIKEY

module.exports = function (app, db) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      res.send({ stockData: await getStockData(req.query.stock) });
    });
  
  function getStockData (stock) {
    return fetchStock(stock)
  }

  function loadStock (stock) {
    db.collection(
  }

  function fetchStock (stock) {
    return axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${avKey}`)
      .then(resp => ({
        stock: resp.data['Global Quote']['01. symbol'],
        price: resp.data['Global Quote']['05. price']
      }));
  }
};