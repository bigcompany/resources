var resource = require('resource');

var queue = resource.use('queue');

var creature = resource.use('creature');

creature.onAny(function (data) {
  resource.logger.info(this.event.magenta + ': ', data);
});

//
// Create an instance of queue with repeat turned ON
//
queue.create({
  interval: 1200,
  concurrency: 2,
  repeat: true
}, function (err, _queue) {

  //
  // Because repeat is set to true, we only have to push these jobs once.
  //
  _queue.push({
    method: 'creature::talk',
    with: 'Fire!'
  });
  _queue.push({
    method: 'creature::fire',
    with: {
      power: 9001,
      direction: 'left'
    }
  });

  _queue.start();
});
