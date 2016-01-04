/**
 * Provider object
 */

function Provider(bulkSize, minFlushRate, maxFlushRate) {
  this.bulkSize = bulkSize;
  this.minFlushRate = minFlushRate;
  this.maxFlushRate = maxFlushRate;
}

// Export provider constructor
module.exports = Provider;
