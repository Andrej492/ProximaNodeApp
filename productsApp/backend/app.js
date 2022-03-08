const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const Product = require('./models/product');
const { couldStartTrivia } = require('typescript');

const app = express();

mongoose.connect("mongodb+srv://andrejMongoDB:JDR1BhjNs3gYs1q8@cluster0.udchr.mongodb.net/proximaNodeApp?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to Database!');
  })
    .catch(() => {
      console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get('/products', (req, res, next) => {
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

app.post('/products', (req, res, next) => {
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

app.delete('/products/:id', (req, res, next) => {
  Product.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: "Product deleted!" });
  })
});

module.exports = app;
