//
// The queue can call resource methods with call signature (options, callback).
//

//
// Example uses `queue` and `creature` resources
//
var resource = require('resource'),
    queue = resource.use('queue'),
    creature = resource.use('creature');

//
// Observe when methods on creature are called
//
creature.onAny(function (data) {
  resource.logger.info(this.event.magenta + ': ', data);
});

//
// Create a new queue, with a processing delay of 500 milliseconds ( and default concurency of 1 )
// This means that items in the queue are processed every 1/2 second
//
queue.create({
  interval: 5000,
  concurrency: 2
}, function (err, _queue) {

  //
  // Once the queue is created, push five jobs onto it
  //
  for (var j = 0; j < 5; j++) {
    //
    // Push the resource method "creature.fire"
    //
    _queue.push({
      method: 'creature::fire',
      //
      // Jobs on the queue support `with` metadata
      //
      with: {
        power: (10 * (j + 1)),
        direction: ['down', 'left', 'up', 'down', 'right'][j]
      }
    });
  }

  // 
  // Now that the queue has been created and populated with jobs, start it
  //
  _queue.start();
});
