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
var _ = require('lodash');

const avKey = process.env.ALPHAVANTAGE_APIKEY

module.exports = function (app, db) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      res.send({ stockData: await getStockData(req.query.stock, req.query.like, req.ip) });
    });
  
  function getStockData (stock, like, ip) {
    return new Promise((resolve, reject) => {
      loadStock(stock)
        .then(doc => {
          if (doc) return process(doc)
          fetchStock(stock)
            .then(process)
            .catch(reject)
        })
        .catch(reject)

      async function process(data) {
        const likeNum = like ? 1 : 0;
        data.likes = data.likes ? data.likes + likeNum : likeNum;
        if (like) {
          if (! await hasLike(data.stock, ip)) {
            data.likes++
            return saveStock(data).then(resolveDoc)
          }
        }
        resolveDoc(data);
      }
      
      function resolveDoc(data) {
        resolve(_.pick(data, ['stock', 'price', 'likes']));
      }
    });
  }

  async function hasLike(stock, ip) {
    return !! await db.collection('stockLikes').findOne({ stock, ip })
  }
  
  function likeStock(stock, ip) {
    db.collection('stockLikes').findOneAndUpdate(
      { stock, ip }, 
      { $set: { stock, ip } },
      { upsert: true }
    );
  }
  
  function saveStock (data) {
    return db.collection('stocks').findOneAndUpdate(
      { stock: data.stock }, 
      { $set: data }, 
      { upsert: true, returnOriginal: false }
    ).then(result => result.value)
  }
  
  function loadStock (stock) {
    return db.collection('stocks').findOne({ stock })
  }

  function fetchStock (stock) {
    return axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${avKey}`)
      .then(resp => ({
        stock: resp.data['Global Quote']['01. symbol'],
        price: resp.data['Global Quote']['05. price'],
      }));
  }
};