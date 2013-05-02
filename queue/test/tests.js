var tap = require('tap'),
    resource = require('resource');

resource.use('queue');

var counter = resource.counter = resource.define('counter');
counter.property('message', {
  type: 'string'
});
counter.property('timestamp');

counter.persist('memory');

counter.before('create', function (data, next) {
  console.error('# about to create %j', data);
  next(null, data);
});

counter.after('create', function (data, next) {
  console.error('# just created %j', data);
  next(null, data);
});

var queue;

resource.queue.on('error', function (err) {
  throw err;
});

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
  t.equal(queue.elements.length, 0, 'queue length is now 0');
  queue.push({
    method: 'counter::create',
    with: { timestamp: new Date(), message: 'one' }
  }, function (err, _queue) {
    t.error(err, 'queue.push called successfully');
    t.equal(_queue.elements.length, 1, 'queue length is now 1');
    queue = _queue;
    t.end();
  });
});

tap.test('extend the queue with multiple elements', function (t) {
  queue.extend([
    {
      method: 'counter::create',
      with: { timestamp: new Date(), message: 'two' }
    },
    {
      method: 'counter::create',
      with: { timestamp: new Date(), message: 'three' }
    }
  ], function (err, _queue) {

    t.error(err, 'queue.extend called successfully');
    t.equal(_queue.elements.length, 3, 'queue length is now 3');
    queue = _queue;
    t.end();
  });
});

tap.test('shift an element off the queue', function (t) {
  var element;
  element = queue.shift(function (err, _queue) {
    t.error(err, 'queue.shift called successfully');
    t.equal(_queue.elements.length, 2, 'queue length is now 2');

    queue = _queue;

    t.equal(element.with.message, 'one', 'message is "one"');
    t.end();
  });
});

tap.test('take multiple elements from the queue', function (t) {
  t.plan(5);

  queue.concurrency = 2;

  var elems;

  elems = queue.take(function (err, _queue) {
    t.error(err, 'queue.take called successfully');

    t.equal(_queue.elements.length, 0, 'queue length is now 0');

    queue = _queue;
    queue.concurrency = 1;

    t.doesNotThrow(function () {
      t.equal(elems[0].with.message, 'two', 'message is "two"');
      t.equal(elems[1].with.message, 'three', 'message is "three"');
    }, 'take returned 2 elements');
    t.end();
  });
});

tap.test('repopulate the queue', function (t) {
  queue.extend([
    {
      method: 'counter::create',
      with: { timestamp: new Date(), message: 'one' }
    },
    {
      method: 'counter::create',
      with: { timestamp: new Date(), message: 'two' }
    },
    {
      method: 'counter::create',
      with: { timestamp: new Date(), message: 'three' }
    }
  ], function (err, _queue) {
    t.error(err, 'queue.extend called successfully');
    t.equal(_queue.elements.length, 3, 'queue length is now 3');

    queue = _queue;

    t.end();
  });
});

tap.test('start the queue and run for 11 seconds', function (t) {
  t.doesNotThrow(function () {
    queue.start();
  }, 'queue starts');
  t.end();
});

tap.test('stop the queue after 11 seconds', function (t) {
  setTimeout(function () {
    t.doesNotThrow(function () {
      queue.stop();
    }, 'queue stops');

    t.end();
  }, 11000);
});

tap.test('queue elements processed as expected', function (t) {
  counter.all(function (err, counts) {
    t.error(err, 'no error');

    t.equal(counts.length, 3, '3 elements were processed by the queue');
    t.ok(hasMessage('one'), 'first job was executed');
    t.ok(hasMessage('two'), 'second job was executed');
    t.ok(hasMessage('three'), 'third job was executed');

    t.equal(queue.elements.length, 3, 'queue has 3 elements');
    t.equal(queue.elements[0].with.message, 'one', 'first job is now first in queue');
    t.equal(queue.elements[1].with.message, 'two', 'second job is now second in queue');
    t.equal(queue.elements[2].with.message, 'three', 'third job is now third in queue');

    t.end();

    function hasMessage(msg) {
      return counts.some(function (c) {
        return c.message === msg;
      });
    }
  });
});
