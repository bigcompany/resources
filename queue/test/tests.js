var tap = require('tap'),
    resource = require('resource');

resource.use('queue');

var counter = resource.counter = resource.define('counter');
counter.persist('memory');


var queue;

tap.test('create a queue with repeat', function (t) {
  resource.queue.create({ repeat: true }, function (err, _queue) {

    t.equal(_queue.concurrency, 1, 'default concurrency is 1');
    t.equal(_queue.interval, 5000, 'default interval is 5000');
    t.equal(_queue.wait, true, 'default wait is true');
    t.equal(_queue.repeat, true, 'repeat is set to true');
    t.equal(_queue.autosave, true, 'default autosave is true');
    t.doesNotThrow(function () {
      t.equal(_queue.elements.length, 0, 'elements.length is 0');
    }, 'elements has a length property');

    queue = _queue;
 
    t.end();
  });
});

tap.test('push an element onto the queue', function (t) {
  t.equal(queue.elements.length, 0, 'queue length is now 1');
  //
  // TODO: This breaks because queue.elements is a List type instead of an Array
  //
  t.doesNotThrow(function () {
    queue.push({ method: 'counter::create', with: { timestamp: new Date(), message: 'one' } });
  }, 'queue.push called successfully');
  t.equal(queue.elements.length, 1, 'queue length is now 1');
  t.end();
});

tap.test('extend the queue with multiple elements', function (t) {
  t.doesNotThrow(function () {
    queue.extend([
      {
        method: 'counter::create',
        with: { timestamp: new Date(), message: 'two' }
      },
      {
        method: 'counter::create',
        with: { timestamp: new Date(), message: 'three' }
      }
    ]);
  }, 'queue.extend called successfully');
  t.equal(queue.elements.length, 3, 'queue length is now 3');
  t.end();
});

tap.test('shift an element off the queue', function (t) {
  var element;
  t.doesNotThrow(function () {
    element = queue.shift();
  }, 'queue.shift called successfully');
  t.equal(queue.elements.length, 2, 'queue length is now 2');

  t.equal(element.with.message, 'one', 'message is "one"');
  t.end();
});

tap.test('take multiple elements from the queue', function (t) {
  t.plan(5);

  var elems;

  t.doesNotThrow(function () {
    elems = queue.take(2);
  }, 'queue.take called successfully');

  t.equal(queue.elements.length, 0, 'queue length is now 0');
  t.doesNotThrow(function () {
    t.equal(elems[0].with.message, 'two', 'message is "two"');
    t.equal(elems[1].with.message, 'three', 'message is "three"');
  }, 'take returned 2 elements');
  t.end();
});

tap.test('start processing the queue', function (t) {
  t.doesNotThrow(function () {
    queue.start();
  }, 'queue starts');
  t.end();
});

tap.test('stop processing the queue', function (t) {
  t.doesNotThrow(function () {
    queue.stop();
  }, 'queue stops');

  //
  // TODO: This hangs. Figure out why. Something is broken.
  //

  t.end();
});

//
// TODO: Test the processing of elements
// TODO: Write tests that break autosave (turning off wait should do it)
//
