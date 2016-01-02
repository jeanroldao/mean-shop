var assert = require('assert');
var superagent = require('superagent');
var express = require('express');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe("Category API", function() {
  var server;
  var Category;
  
  before(function(){
    var app = express();
    
    require('./models')(wagner);
    app.use(require('./api')(wagner));
    
    server = app.listen(3000);
    
    Category = wagner.get('Category');
  });
  
  after(function(){
    server.close();
  });
  
  beforeEach(function(done) {
    Category.remove({}, function(error) {
      assert.ifError(error);
      done();
    });
  });
  
  it('can load a category by id', function(done) {
    Category.create({ _id: 'Electronics' }, function(error, doc) {
      assert.ifError(error);
      
      var url = URL_ROOT + '/category/id/Electronics';
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result.category);
        assert.equal(result.category._id, 'Electronics');
        
        done();
      });
    });
  });
  
  it('can load all categories that have a certain parent', function(done) {
    var categories = [
      { _id: 'Electronics' },
      { _id: 'Phones', parent: 'Electronics' },
      { _id: 'Laptops', parent: 'Electronics' },
      { _id: 'Bacon' }
    ];
    
    Category.create(categories, function(error, categories) {
      var url = URL_ROOT + '/category/parent/Electronics';
      
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        
        // 2 categories ordered by _id
        assert.equal(result.categories.length, 2);
        assert.equal(result.categories[0]._id, 'Laptops');
        assert.equal(result.categories[1]._id, 'Phones');
        
        done();
      });
    })
  });
    
});

describe("Product API", function() {
  var server;
  var Category;
  var Product;
  
  before(function(){
    var app = express();
    
    require('./models')(wagner);
    app.use(require('./api')(wagner));
    
    server = app.listen(3000);
    
    Category = wagner.get('Category');
    Product = wagner.get('Product');
  });
  
  after(function(){
    server.close();
  });
  
  beforeEach(function(done) {
    Category.remove({}, function(error) {
      assert.ifError(error);
      Product.remove({}, function(error) {
        assert.ifError(error);
        done();
      });
    });
  });
  
  it('can load a product by id', function(done) {
    var PRODUCT_ID = '000000000000000000000001';
    var product = {
      _id: PRODUCT_ID,
      name: 'LG G4',
      category: { _id: 'Electronics' },
      price: {
        amount: 300,
        currency: 'USD'
      }
    };

    Product.create(product, function(error, doc) {
      assert.ifError(error);
      
      var url = URL_ROOT + '/product/id/' + PRODUCT_ID;
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result.product);
        assert.equal(result.product._id, PRODUCT_ID);
        assert.equal(result.product.name, 'LG G4');
        
        done();
      });
    });
  });
  
  it('can load all products width sub-categories ordered by name', function(done) {
    var categories = [
      { _id: 'Electronics' },
      { _id: 'Phones', parent: 'Electronics' },
      { _id: 'Laptops', parent: 'Electronics' },
      { _id: 'Bacon' }
    ];
    
    var products = [
      { 
        name: 'LG G4',
        category: { _id: 'Phones', ancestors: ['Electronics', 'Phones']},
        price: {
          amount: 300,
          currency: 'USD'
        }
      },
      { 
        name: 'Asus Zenbook',
        category: { _id: 'Laptops', ancestors: ['Electronics', 'Laptops']},
        price: {
          amount: 2000,
          currency: 'USD'
        }
      },
      { 
        name: 'Flying Pigs Farm Pasture Reised Pork Bacon',
        category: { _id: 'Bacon', ancestors: ['Bacon']},
        price: {
          amount: 20,
          currency: 'USD'
        }
      }
    ];
    
    Category.create(categories, function(error, categories) {
      assert.ifError(error);
      console.log('categories created');
      Product.create(products, function(error, products) {
        assert.ifError(error);
        console.log('products created');
        
        var url = URL_ROOT + '/product/category/Electronics';
        superagent.get(url, function(error, res) {
            assert.ifError(error);
            console.log('get Electronics');
            
            var result;
            assert.doesNotThrow(function() {
              result = JSON.parse(res.text);
            });
            
            // 2 categories ordered by _id
            assert.equal(result.products.length, 2);
            assert.equal(result.products[0].name, 'Asus Zenbook');
            assert.equal(result.products[1].name, 'LG G4');
            
            done();
        });
      });
    });
  });
  it('can load all products width sub-categories ordered by price', function(done) {
    var categories = [
      { _id: 'Electronics' },
      { _id: 'Phones', parent: 'Electronics' },
      { _id: 'Laptops', parent: 'Electronics' },
      { _id: 'Bacon' }
    ];
    
    var products = [
      { 
        name: 'LG G4',
        category: { _id: 'Phones', ancestors: ['Electronics', 'Phones']},
        price: {
          amount: 300,
          currency: 'USD'
        }
      },
      { 
        name: 'Asus Zenbook',
        category: { _id: 'Laptops', ancestors: ['Electronics', 'Laptops']},
        price: {
          amount: 2000,
          currency: 'USD'
        }
      },
      { 
        name: 'Flying Pigs Farm Pasture Reised Pork Bacon',
        category: { _id: 'Bacon', ancestors: ['Bacon']},
        price: {
          amount: 20,
          currency: 'USD'
        }
      }
    ];
    
    Category.create(categories, function(error, categories) {
      assert.ifError(error);
      //console.log('categories created');
      Product.create(products, function(error, products) {
        assert.ifError(error);
        //console.log('products created');
        
        var url = URL_ROOT + '/product/category/Electronics?price=1';
        superagent.get(url, function(error, res) {
            assert.ifError(error);
            //console.log('get Electronics');
            
            var result;
            assert.doesNotThrow(function() {
              result = JSON.parse(res.text);
            });
            
            // 2 categories ordered by _id
            assert.equal(result.products.length, 2);
            assert.equal(result.products[0].name, 'LG G4');
            assert.equal(result.products[1].name, 'Asus Zenbook');
            
            done();
        });
      });
    });
  });
  
});