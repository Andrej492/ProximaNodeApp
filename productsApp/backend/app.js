const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const Product = require('./models/product');
const { couldStartTrivia } = require('typescript');

const app = express();

mongoose.connect("mongodb+srv://andrejMongoDB:JDR1BhjNs3gYs1q8@cluster0.udchr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
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
app.post('/products', (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    available: req.body.available
  });
  console.log(product);
  res.status(201).json({
    message: 'Product added succesfully!'
  });
});

app.get('/products', (req, res, next) => {
  const products = [
    { id: 'sdah8h2b2', name: 'First computer', price: 1230, available: false },
    { id: 'sdah324328h2b2', name: 'Second computer', price: 1030, available: false },
    { id: 'sdah11238h2b2', name: 'Third computer', price: 2230, available: true },
    { id: 'sddf43ah8h2b2', name: 'Fourth computer', price: 1230, available: true },
  ];
  res.status(200).json({
    message: 'Products fetched succesffully!',
    products: products
  });
});

module.exports = app;
