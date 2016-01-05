/**
 * Provider object
 */

function Provider(provider) {
  this.name = provider.name;
  this.bulkSize = provider.bulkSize;
  this.minFlushRate = provider.minFlushRate;
  this.maxFlushRate = provider.maxFlushRate;
}

Provider.prototype.update = function (provider) {
  this.name = provider.name;
  this.bulkSize = provider.bulkSize;
  this.minFlushRate = provider.minFlushRate;
  this.maxFlushRate = provider.maxFlushRate;
}

// Export provider constructor
module.exports = Provider;
