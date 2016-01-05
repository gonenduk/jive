var config = require('../config');
var Provider = require('./provider');

/**
 * Dispatcher object
 */

var dispatcher = {
  providers: {},       // will hold a map of providers (indexed by name)

  add: function (provider) {
    this.providers[provider.name] = new Provider(provider);
  },

  delete: function (name) {
    delete this.providers[name];
  },

  update: function (name, provider) {
    // Update provider
    this.providers[name].update(provider);

    // Update key of map on name change
    if (name != provider.name) {
      this.providers[provider.name] = this.providers[name];
      delete this.providers[name];
    }
  }
};

// Initialize dispatcher with providers from config file
config.providers.forEach(function (provider) {
  dispatcher.add(provider);
});

// Export dispatcher
module.exports = dispatcher;
