var config = require('../config');
var Provider = require('./provider');

/**
 * Dispatcher object
 */

var dispatcher = {
  providers: {},       // will hold a map of providers (indexed by name)

  add: function (name, bulkSize, minFlushRate, maxFlushRate) {
    this.providers[name] = new Provider(bulkSize, minFlushRate, maxFlushRate);
  },

  remove: function (name) {
    delete this.providers[name];
  }
};

// Initialize dispatcher with providers from config file
config.providers.forEach(function (provider) {
  dispatcher.add(provider.name, provider.bulkSize, provider.minFlushRate, provider.maxFlushRate);
});

// Export dispatcher
module.exports = dispatcher;
