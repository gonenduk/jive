/**
 * Provider object
 */

function Provider(provider) {
  // settings
  this.name = provider.name;
  this.bulkSize = provider.bulkSize;
  this.minFlushRate = provider.minFlushRate;
  this.maxFlushRate = provider.maxFlushRate;

  // queue of reports
  this.queue = [];
}

Provider.prototype.update = function (provider) {
  this.name = provider.name;
  this.bulkSize = provider.bulkSize;
  this.minFlushRate = provider.minFlushRate;
  this.maxFlushRate = provider.maxFlushRate;
};

Provider.prototype.report = function (data) {
  this.queue.push(data);
};


// Export provider constructor
module.exports = Provider;
