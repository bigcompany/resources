var resource = require('resource');

var queue = resource.use('queue');

//
// The queue can call resource methods with call signature (options, callback).
// We will use creature.fire for an example.
//
var creature = resource.use('creature');

//
// Observe when methods on creature are called
//
creature.onAny(function (data) {
  resource.logger.info(this.event.magenta + ': ', data);
});

//
// Any methods on the queue resource which take a queue instance as the first
// argument are bound to the instance after any persistance method which
// returns such instances is called.
//
queue.create({
  interval: 500
}, function (err, _queue) {

  //
  // Push five jobs onto the instance of this queue
  //
  for (var j = 0; j < 5; j++) {
    //
    // These specify a resource method to call and metadata to call it
    // with.
    //
    _queue.push({
      method: 'creature::fire',
      with: {
        power: 10 * (j + 1),
        direction: ['down', 'left', 'up', 'down', 'right'][j]
      }
    });
  }

  // 
  // On instances, the start method is an alias for the load method.
  //
  _queue.start();
});
