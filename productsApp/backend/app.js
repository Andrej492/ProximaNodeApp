const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productsRoutes = require('./routes/products');

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

app.use("/products", productsRoutes);

module.exports = app;
