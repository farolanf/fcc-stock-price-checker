var axios = require('axios');
var _ = require('lodash');

const avKey = process.env.ALPHAVANTAGE_APIKEY

function Stock (db) {
  const stocks = db.collection('stocks');
  const stockLikes = db.collection('stockLikes');

  this.getStockData = getStockData;
  
  function getStockData (stock, like, ip) {
    return new Promise((resolve, reject) => {
      loadStock(stock)
        .then(doc => {
          if (doc) return process(doc)
          return fetchStock(stock)
            .then(saveStock)
            .then(process)
            .catch(reject)
        })
        .catch(reject)

      async function process(data) {
        await likeStock(like, data.stock, ip);
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
}

module.exports = {
  Stock
}