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
// Create an instance of queue.
//
queue.create({
  interval: 1200,
  concurrency: 2,
  repeat: true
}, function (err, _queue) {
  //
  // Any methods on the queue resource which take a queue instance as the first
  // argument are bound to the instance after any persistance method which
  // returns such instances is called. Here, we push "jobs" to the instance
  // of queue which specify a resource method to call and metadata to call it
  // with.
  //
  // Because repeat is set to true, we only have to push these jobs once.
  //
  _queue.push({
    method: 'jobs::shortJob',
    with: { foo: 'bar' }
  });
  _queue.push({
    method: 'jobs::longJob',
    with: { baz: 'quux' }
  });

  // 
  // On instances, the start method is an alias for the load method.
  //
  _queue.start();
});
