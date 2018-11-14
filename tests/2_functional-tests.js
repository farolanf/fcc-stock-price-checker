/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var mongo = require('mongodb');
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      before(function(done) {
        mongo.connect(process.env.DB, (err, db) => {
          // start with zero likes
          db.collection('stockLikes').deleteMany({
            $or: [{ stock: 'goog' }, { stock: 'msft' }]
          }).then(() => done());
        });
      });
      
      test('1 stock', function(done) {
         chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'stockData');
            assert.isString(res.body.stockData.stock); 
            assert.isString(res.body.stockData.price); 
            assert.isNumber(res.body.stockData.likes); 
            done();
          });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.likes, 1);
            done();
          });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.likes, 1);
            done();
          });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'msft']})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body.stockData);
            // expect goog has likes from previous tests
            assert.equal(res.body.stockData[0].rel_likes, 1);
            assert.equal(res.body.stockData[1].rel_likes, -1);
            done();
          });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'msft'], like: true})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body.stockData);
            assert.equal(res.body.stockData[0].rel_likes, 0);
            assert.equal(res.body.stockData[1].rel_likes, 0);
            done();
          });
      });
      
    });

});
