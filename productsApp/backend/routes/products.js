const express = require('express');

const Product = require('../models/product');
const router = express.Router();

router.get('', (req, res, next) => {
  Product.find()
    .then(products => {
      res.status(200).json({
        message: 'Products fetched succesffully!',
        products: products
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/:id', (req, res, next) => {
  Product.findById(req.params.id).then(product => {
    if(product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found!"});
    }
  })
});

router.post('', (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    available: req.body.available
  });
  product.save().then(createdProduct => {
    res.status(201).json({
    message: 'Product added succesfully!',
    productId: createdProduct._id
  });
  });
});

router.put('/:id', (req, res, next) => {
  const product = new Product({
    _id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    available: req.body.available
  });
  Product.updateOne({
    _id: req.params.id
  }, product).then(result => {
    res.status(200).json({ message: "Update succesfull!"});
  })
});

router.delete('/:id', (req, res, next) => {
  Product.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: "Product deleted!" });
  })
});

module.exports = router;
