const mongoose = require('mongoose');
const { stringify } = require('querystring');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price : { type: Number, required: true },
  available: { type: Boolean, required: true },
});

module.exports = mongoose.model('Product', productSchema);
