var resource = require('resource');

var queue = resource.use('queue');

//
// The queue can call resource methods with call signature (options, callback)
// Here I just define a new resource as an example.
//
var jobs = resource.define('jobs');

var i = 0;
jobs.method('count', count);
function count(options, callback) {
  i++;
  resource.logger.info(options.message, i, i);
  callback(null);
}

//
// Create an instance of queue.
//
queue.create({
  interval: 500
}, function (err, _queue) {
  for (var j = 0; j < 5; j++) {
    _queue.push({
      method: 'jobs::count',
      with: { 'message': '%d! %d times!' }
    });
  }

  // 
  // On instances, the start method is an alias for the load method.
  //
  _queue.start();
});
