var express = require('express');
var status = require('http-status');
var utils = require('./utils');

module.exports = function(wagner) {
  var api = express.Router();
  
  api.get('/product/id/:id', wagner.invoke(function(Product) {
    return function (req, res) {
      var id = req.params.id
      Product.findOne({ _id: id }, utils.handleOne('product', res));
    };
  }));
  
  api.get('/product/category/:id', wagner.invoke(function(Product) {
    return function(req, res) {
      var sort = { name: 1 };
      if (req.query.price === '1') {
        //console.log('order by price');
        sort = { 'internal.approximatePriceUSD': 1 };
      } else if (req.query.price === '1') {
        sort = { 'internal.approximatePriceUSD': -1 };
      }
      
      var catId = req.params.id;
      Product
        .find({ 'category.ancestors': catId })
        .sort(sort)
        .exec(utils.handleMany('products', res));
    };
  }));
  
  api.get('/category/id/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      var id = req.params.id;
      Category.findOne({ _id: id }, utils.handleOne('category', res));
    };
  }));
  
  api.get('/category/parent/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      var id = req.params.id;
      
      Category
        .find({ parent: id })
        .sort({ _id: 1 })
        .exec(utils.handleMany('categories', res));
      
    };
  }));
  
  return api;
};