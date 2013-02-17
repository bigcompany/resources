var resource = require('resource');

var queue = resource.use('queue');

//
// The queue can call resource methods with call signature (options, callback)
// Here I just define a new resource as an example.
//
var jobs = resource.define('jobs');

jobs.method('shortJob', shortJob);
function shortJob(options, callback) {
  resource.logger.info('short job: %j', options);
  setTimeout(callback, 50);
}

jobs.method('longJob', longJob);
function longJob(options, callback) {
  resource.logger.info('long job: %j', options);
  setTimeout(callback, 1000);
}

//
// Queue states are represented by objects which can/will be
// instantiated/persisted.
//
// I call this "self" here in order to emphasize that this is (potentially) an
// instance of the queue resource, and because the call signatures for
// queue.push, queue.shift and queue.take mirror those of python-style methods,
// where the instance of the class is explicitly the first argument of the
// method.
//
var self = {
  interval: 1200,
  concurrency: 2,
  elements: []
};

//
// This function "starts" the particular queue. I didn't call it "start" because
// I think "start" should get all persisted queues and "load" them
//
queue.load(self);

//
// Push elements onto the queue with a resource method to call and an options
// hash to call it with.
//
setInterval(function () {
  queue.push(self, {
    method: 'jobs::shortJob',
    with: { foo: 'bar' }
  });
  queue.push(self, {
    method: 'jobs::longJob',
    with: { baz: 'quux' }
  });
}, 1000);
