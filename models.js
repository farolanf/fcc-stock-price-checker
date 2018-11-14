var axios = require('axios');
var _ = require('lodash');

const avKey = process.env.ALPHAVANTAGE_APIKEY

function Stock (db) {
  const stockLikes = db.collection('stockLikes');

  this.getStockData = getStockData;
  
  function getStockData (stock, like, ip) {
    return fetchStock(stock)
      .then(async stockData => {
        await likeStock(like, stock, ip);
        stockData.likes = await getStockLikes(stock);
        return stockData
      })
  }

  async function getStockLikes(stock) {
    return await stockLikes.count({ stock })
  }
  
  async function likeStock(like, stock, ip) {
    if (like) {
      await stockLikes.findOneAndUpdate(
        { stock, ip }, 
        { $set: { stock, ip } },
        { upsert: true }
      );
    } else {
      await stockLikes.deleteOne({ stock, ip })
    }
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