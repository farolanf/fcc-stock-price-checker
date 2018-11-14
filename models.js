var axios = require('axios');
var _ = require('lodash');

const avKey = process.env.ALPHAVANTAGE_APIKEY

function Stock (db) {
  const stockLikes = db.collection('stockLikes');
  const stocks = db.collection('stocks');

  this.getStockData = getStockData;
  
  async function getStockData (stock, like, ip) {
    stock = stock.toLowerCase();
    const stockData = await fetchStock(stock)
    if (!stockData) return
    await likeStock(like, stock, ip);
    stockData.likes = await getStockLikes(stock);
    return stockData
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
    }
  }

  /**
   * Fetch cached or fresh stock.
  **/
  async function fetchStock (stock) {
    let data = await stocks.findOne({ stock })
    if (!data) {
      data = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${avKey}`)
        .then(resp => ({
          stock: resp.data['Global Quote']['01. symbol'].toLowerCase(),
          price: resp.data['Global Quote']['05. price'],
        }))
      data && await stocks.findOneAndUpdate(
        { stock: data.stock }, 
        { $set: data },
        { upsert: true }
      );
    }
    return _.pick(data, ['stock', 'price']);
  }
}

module.exports = {
  Stock
}