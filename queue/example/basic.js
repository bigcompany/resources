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
  concurrency: 2
}, function (err, q) {

  //
  // Any methods on the queue resource which take a queue instance as the first
  // argument are bound to the instance after any persistance method which
  // returns such instances is called
  //

  //
  // q.start is an alias for q.load for instances
  //
  q.start();

  //
  // Push elements onto the queue with a resource method to call and an options
  // hash to call it with.
  //
  setInterval(function () {
    q.push({
      method: 'jobs::shortJob',
      with: { foo: 'bar' }
    });

    q.push({
      method: 'jobs::longJob',
      with: { baz: 'quux' }
    });
  }, 1000);

});
