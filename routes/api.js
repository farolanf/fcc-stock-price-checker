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
      res.send({ stockData: await getStockData(req.query.stock, req.query.like) });
    });
  
  function getStockData (stock, like) {
    return new Promise((resolve, reject) => {
      loadStock(stock)
        .then(process)
        .catch(() => {
          fetchStock(stock)
            .then(process)
            .catch(reject)
        });
    });
    
    function process(data) {
      data.likes = data.likes ? data.likes + like : 0
    }
  }

  function saveStock (data) {
    db.collection('stocks').
  }
  
  function loadStock (stock) {
    return new Promise((resolve, reject) => {
      db.collection('stocks').findOne({ stock }, (err, doc) => {
        if (err) return reject(err);
        resolve(doc);
      });
    });
  }

  function fetchStock (stock) {
    return axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${avKey}`)
      .then(resp => ({
        stock: resp.data['Global Quote']['01. symbol'],
        price: resp.data['Global Quote']['05. price']
      }));
  }
};