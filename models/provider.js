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

  // Create internal properties - not enumerable (so they don't show up in json of object)
  Object.defineProperties(this,
    {
      "timer": {enumerable: false, writable: true},
      "lastFlush": {enumerable: false, writable: true},
      "flushRequested": {value: false, enumerable: false, writable: true}
    }
  );

  // Start timer
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
    this.requestFlush();
};

Provider.prototype.requestFlush = function (calledByTimer) {
  // Ignore if already got a request and did not handle it yet.
  // This is to avoid the flush for the bulkSize + 1, +2, +3 reports if they arrive before the flush is done
  // or if the timer is expired during a flush.
  if (this.flushRequested)
    return;

  // Also Ignore if there is a limit on the number of flushes
  if (this.lastFlush && this.maxFlushRate > 0)
    if (this.lastFlush + this.maxFlushRate * 1000 > Date.now()) {
      // Restart timer if needed
      if (calledByTimer)
        this.restartTimer();
      return;
    }

  // Mark request to flush
  this.flushRequested = true;

  // Flush the data to the provider.
  // If called by timer do it immediately
  // If by client report which reached the bulkSize, call on next tick to release client
  calledByTimer ? this.flush() : process.nextTick(this.flush.bind(this));
};

Provider.prototype.flush = function () {
  // Check size to report. Exit if nothing to report.
  var size = this.queue.length > this.bulkSize ? this.bulkSize : this.queue.length;
  if (size == 0) {
    this.restartTimer();
    this.flushRequested = false;
    return;
  }

  // Make array of data to report
  var data = new Array(size);
  for (var i = 0; i < size; i++) {
    data[i] = this.queue.shift();
  }

  // Here we will probably commit the array of data to the provider using an HTTP call.
  // In this demo we only print it to the console.
  // In production, if the call fails, the data should be put back in the queue.
  console.log(this.name + " has committed the following data:" + JSON.stringify(data, null, '  '));

  // Commit was done successfully
  this.restartTimer();
  this.flushRequested = false;
  this.lastFlush = Date.now();
};

Provider.prototype.restartTimer = function () {
  if (this.timer)
    clearTimeout(this.timer);
  if (this.minFlushRate > 0)
    this.timer = setTimeout(this.requestFlush.bind(this, true), this.minFlushRate * 1000);
};


// Export provider constructor
module.exports = Provider;
