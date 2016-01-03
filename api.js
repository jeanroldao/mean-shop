var express = require('express');
var status = require('http-status');
var utils = require('./utils');
var bodyparser = require('body-parser');

module.exports = function(wagner) {
  var api = express.Router();
  
  api.use(bodyparser.json());
  
  api.post('/checkout', wagner.invoke(function(User, Stripe) {
    return function(req, res) {
      if (!req.user) {
        return res.status(status.UNAUTHORIZED)
          .json({ error: 'Not logged in' });
      }
      
      req.user.populate(
        { path: 'data.cart.product', model: 'Product' },
        function(error, user) {
          var totalCostUSD = 0;
          user.data.cart.forEach(function(item) {
            totalCostUSD += (item.product.internal.approximatePriceUSD * item.quantity);
          });
          
          Stripe.charges.create({
            amount: Math.ceil(totalCostUSD * 100),
            currency: 'usd',
            source: req.body.stripeToken,
            description: 'Example charge'
          }, function(error, charge) {
            if (error && error.type == 'StripeCardError') {
              console.log({ 'req.body.stripeToken': req.body.stripeToken });
              return res.status(status.BAD_REQUEST)
                .json({ error: error.toString() });
            }
            if (error) {
              console.log({ 'req.body': req.body });
              console.log(error);
              return res.status(status.INTERNAL_SERVER_ERROR)
                .json({ error: error.toString() });
            }
            
            req.user.data.cart = [];
            req.user.save(function() {
              
              // ignoring errors
              return res.json({ id: charge.id });
            });
          });
        });
    };
  }));
  
  api.put('/me/cart', wagner.invoke(function(User) {
    return function(req, res) {
      try {
        var cart = req.body.data.cart;
      } catch (e) {
        return res.status(status.BAD_REQUEST)
          .json({ error: 'No cart specified!' });
      }
      
      req.user.data.cart = cart;
      req.user.save(function(error, user) {
        if (error) {
          return res.status(status.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
        }
        return res.json({ user: user });
      });
    };
  }));
  
  api.get('/me', function(req, res) {
    if (!req.user) {
      return res.status(status.UNAUTHORIZED)
        .json({ error: 'Not logged in' });
    }
    
    req.user.populate(
      { path: 'data.cart.product', model: 'Product' },
      utils.handleOne('user', res));
  });
  
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