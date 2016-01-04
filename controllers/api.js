var express = require('express');
var router = express.Router();
var dispatcher = require('../models/dispatcher');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express API' });
});

module.exports = router;