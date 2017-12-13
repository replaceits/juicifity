var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  if (err) {
    console.log(err);
    throw err;
  }

  const db = client.db('juicifity');

  const collection = db.collection('recipes');

  client.close();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Juicifity'
  });
});

module.exports = router;
