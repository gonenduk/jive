var express = require('express');
var router = express.Router();
var dispatcher = require('../models/dispatcher');

/**
 * Dispatcher API (RESTful API for providers)
 */

// Create
router.post('/providers', function(req, res, next) {
  var name = req.body.name;

  //Check if already exists and report it
  if (name in dispatcher) {
    return res.status(208).end();
  }

  // Add new provider to dispatcher
  dispatcher.add(req.body);

  // Set Location of new provider in http header
  var port = req.app.settings.port;
  var stringPort = port == 80 || port == 443 ? '' : ':' + port;
  res.set('Location', req.protocol + ':/' + req.hostname + stringPort + req.baseUrl + req.path + '/' + name);

  // Return new provider
  res.status(201).json(dispatcher.providers[name]);
});

// Read
router.get('/providers/:name', function(req, res, next) {
  var name = req.params.name;
  if (name in dispatcher.providers)
    res.json(dispatcher.providers[name]);
  else
    res.status(404).end();
});

// Update
router.put('/providers/:name', function(req, res, next) {
  var name = req.params.name;
  if (name in dispatcher.providers) {
    dispatcher.update(name, req.body);
    res.json(dispatcher.providers[req.body.name]);
  }
  else
    res.status(404).end();
});

// Delete
router.delete('/providers/:name', function(req, res, next) {
  var name = req.params.name;
  if (name in dispatcher.providers) {
    dispatcher.delete(name);
    res.status(200).end();
  }
  else
    res.status(404).end();
});

// List
router.get('/providers', function(req, res, next) {
  res.json(dispatcher.providers);
});


/**
 * Client Report API (RESTful API)
 */

// Create
router.post('/reports', function(req, res, next) {
  dispatcher.report(req.body);
  res.status(201).end();
});

module.exports = router;
