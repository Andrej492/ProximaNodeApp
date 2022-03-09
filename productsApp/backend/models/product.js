const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price : { type: Number, required: true },
  available: { type: Boolean, required: true },
  dateCreated: { type: Date, required: true },
  dateUpdated: { type: Date, required: true },
  edited: { type: Boolean, required: true }
});

module.exports = mongoose.model('Product', productSchema);
