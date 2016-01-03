//var mongoose = require('mongoose');
var Category = require('./schema.category');
//var fx = require('./fx');

module.exports = function(db, fx) {
  var productSchema = {
    name: { type: String, required: true },
    pictures: [{ type: String, match: /^http:\/\//i }],
    price: {
      amount: { 
        type: Number, 
        required: true, 
        set: function(v) {
          this.internal.approximatePriceUSD = v / (fx()[this.price.currency] || 1);
          return v;
        }
      },
      currency: { 
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        set: function(v) {
          this.internal.approximatePriceUSD = this.price.amount / (fx()[v] || 1);
          return v;
        }
      }
    },
    category: Category.categorySchema,
    internal: {approximatePriceUSD: Number}
  };

  var schema = new db.Schema(productSchema);
  
  schema.index({ name: 'text' });

  var currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  schema.virtual('displayPrice').get(function() {
    return currencySymbols[this.price.currency] + this.price.amount;
  });

  schema.set('toObject', { virtuals: true });
  schema.set('toJSON', { virtuals: true });

  //module.exports = schema;
  //module.exports.productSchema = productSchema;
  return db.model('Product', schema, 'products');
};

