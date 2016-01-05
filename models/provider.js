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

  // timer
  var timer;
  this.restartTimer = function () {
    if (timer)
      clearTimeout(timer);
    if (this.minFlushRate > 0)
      timer = setTimeout(Provider.prototype.flush.bind(this), this.minFlushRate * 60000);
  };
  this.restartTimer();
}

Provider.prototype.update = function (provider) {
  this.name = provider.name;
  this.bulkSize = provider.bulkSize;
  this.minFlushRate = provider.minFlushRate;
  this.maxFlushRate = provider.maxFlushRate;

  // restart flush timer
  this.restartTimer();
};

Provider.prototype.report = function (data) {
  this.queue.push(data);

  // Flush if bulk size is reached
  // Do it in a callback so the client is released
  if (this.queue.length >= this.bulkSize)
    process.nextTick(this.flush.bind(this));
};

Provider.prototype.flush = function () {
  // Check size to report. Exit if nothing to report.
  var size = this.queue.length > this.bulkSize ? this.bulkSize : this.queue.length;
  if (size == 0) {
    this.restartTimer();
    return;
  }

  // Make array of data to report
  var data = new Array(size);
  for (var i = 0; i < size; i++) {
    data[i] = this.queue.shift();
  }

  // Here we will probably commit the array of data to the provider using an HTTP call.
  // In this demo we only print it to the console.
  // If real, if the call fails, the data should be put back in the queue.
  console.log(this.name + " has committed the following data:" + JSON.stringify(data, null, '  '));

  this.restartTimer();
};


// Export provider constructor
module.exports = Provider;
