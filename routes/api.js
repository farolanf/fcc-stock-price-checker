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
      res.send({ stockData: await getStock(req.query.stock) });
    });
    
};

function getStockData (stock) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${avKey}`)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(reject)
  });
}

function getStock (stock) {
}