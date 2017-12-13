var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var shortid = require('shortid');

/* GET Recipes page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Juicifity'
  });
});

/**
 * GET recipe by ID
 * ID must be 7-14 characters long, alphanumeric in addition to the characters `-` and `_`
 */
router.get(/^\/[a-zA-Z0-9_-]{7,14}$/, function (req, res, next) {
  recipeId = req.path.substr(1);

  MongoClient.connect("mongodb://localhost:27017", function (err, client) {
    if (err) {
      console.log(err);
      throw err;
    }

    const db = client.db('juicifity');

    const collection = db.collection('recipes');

    collection.findOne({
      _id: recipeId
    }, function (err, result) {
      if (err) {
        res.status(500).send("Uh oh");
      }
      if (result) {
        res.send(JSON.stringify(result));
      } else {
        res.status(404).send("Not found.");
      }
    });
  });
});

router.post('/add', function (req, res) {
  MongoClient.connect("mongodb://localhost:27017", function (err, client) {
    if (err) {
      res.status(500).send(JSON.stringify({
        posted: false,
        id: null
      }));
    }

    const db = client.db('juicifity');

    const collection = db.collection('recipes');

    collection.insertOne({
      _id: shortid.generate(),
      recipeName: req.body.recipeName,
      nicotineBase: req.body.nicotineBase,
      targetNicotine: req.body.targetNicotine,
      vgRatio: req.body.vgRatio,
      batchSize: req.body.batchSize,
      flavors: req.body.flavors
    }, function (err, result) {
      res.send(JSON.stringify({
        posted: true,
        id: result.insertedId
      }));
      client.close();
    });
  });
});

module.exports = router;
