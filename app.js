const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const lo = require("lodash");
const Schema = mongoose.Schema;
const collections = require("./collections");
const fs = require('fs');
const cors = require('cors');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));

app.use(cors({
  origin: [ 'http://localhost:3000', 'https://blissy-e-commerce.onrender.com'], 
  credentials: true,
}));

mongoose.connect("mongodb+srv://davontech3:Freshman2@cluster1.1egbhiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const imageSchema = new Schema({
  id: Number,
  name: String,
  path: String,
  gender: String,
  type: String,
  price: Number
});

const Image = mongoose.model('clothes', imageSchema);

const colArray = [];

for (let i = 0; i < collections.images.length; i++) {
  const col = new Image();
  col.id = collections.images[i].id;
  col.name = collections.images[i].name;
  col.path = collections.images[i].path;
  col.gender = collections.images[i].gender;
  col.type = collections.images[i].type;
  col.price = collections.images[i].price;
  colArray[i] = col;
}
Image.find({}).then(foundImages => {
  if (foundImages.length < 54) {
    Image.insertMany(colArray)
      .then(() => {
        console.log("success");
      })
      .catch(err => {
        console.error(err);
      });
  }
}).catch(err => {
  console.error(err);
});

app.post("/image", function(req, res) {
  const query = Image.where({ name: req.body.name });
  query.findOne()
    .then(image => {
      const path = image.path;
      const type = image.type;
      const price = image.price;
      res.json({
        type: type,
        source: path,
        price: price
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'), function(err) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });
});

app.listen(10000, () => {
  console.log('Server is running on port 10000');
});