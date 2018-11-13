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

module.exports = function (app, db) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      res.send({ stockData: await getStock(req.query.stock) });
    });
    
};

function getStock (stock) {
  return new Promise((resolve, reject) => {
    axios.get('https://finance.google.com/finance/info?q=NASDAQ%3a' + stock)
      .then(resp => {
      })
      .catch(reject)
  });
}
