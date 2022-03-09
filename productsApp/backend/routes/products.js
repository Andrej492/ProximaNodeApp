const express = require('express');
const multer = require('multer');

const Product = require('../models/product');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpeg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP(file.mimetype);
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP(file.mimetype);
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

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

//router.post('', multer(storage).single("image"), (req, res, next) => {});

router.post('', (req, res, next) => {
  const timestamp = new Date().toISOString();
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    available: req.body.available,
    dateCreated: timestamp,
    dateUpdated: timestamp,
    edited: false
  });
  product.save()
    .then(createdProduct => {
      res.status(201).json({
      message: 'Product added succesfully!',
      productId: createdProduct._id,
      product: createdProduct
    });
  });
});

router.put('/:id', (req, res, next) => {
  const timestamp = new Date().toISOString();
  const product = new Product({
    _id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    available: req.body.available,
    dateUpdated: timestamp,
    edited: true,
  });
  Product.updateOne({
    _id: req.params.id
  }, product)
  .then(result => {
    res.status(200).json({
      message: "Update succesfull!",
      product});
  });
});

router.delete('/:id', (req, res, next) => {
  Product.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: "Product deleted!" });
  })
});

module.exports = router;
