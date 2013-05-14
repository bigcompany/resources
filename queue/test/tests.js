var tap = require('tap'),
    resource = require('resource'),
    queue = resource.use('queue'),
    http = resource.use('http'),
    request = http.request;

var counter = resource.counter = resource.define('counter');
counter.property('message', {
  type: 'string'
});
counter.property('timestamp', { type: 'any' });

counter.persist('memory');

counter.before('create', function (data, next) {
  console.error('# about to create %j', data);
  next(null, data);
});

counter.after('create', function (data, next) {
  console.error('# just created %j', data);
  next(null, data);
});

queue.on('error', function (err) {
  console.log('queue error:');
  if (!(err instanceof Error)) {
    console.log(err);
  }
  throw err;
});

var id = 'test-queue';

tap.test('create a queue with repeat', function (t) {
  queue.create({ id: id, repeat: true }, function (err, _queue) {

    t.equal(_queue.concurrency, 1, 'default concurrency is 1');
    t.equal(_queue.interval, 5000, 'default interval is 5000');
    t.equal(_queue.wait, true, 'default wait is true');
    t.equal(_queue.repeat, true, 'repeat is set to true');
    //t.equal(_queue.autosave, true, 'default autosave is true');
    t.doesNotThrow(function () {
      t.equal(_queue.elements.length, 0, 'elements.length is 0');
    }, 'elements has a length property');

    t.end();
  });
});

tap.test('push an element onto the queue', function (t) {
  queue.push(id, {
    method: 'counter::create',
    with: { timestamp: new Date(), message: 'one' }
  }, function (err, _queue) {
    t.error(err, 'queue.push called successfully');
    t.equal(_queue.elements.length, 1, 'queue length is now 1');
    t.end();
  });
});

tap.test('extend the queue with multiple elements', function (t) {
  queue.extend(id, [
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
    t.end();
  });
});

tap.test('shift an element off the queue', function (t) {
  queue.shift(id, function (err, element, _queue) {
    t.error(err, 'queue.shift called successfully');
    t.equal(_queue.elements.length, 2, 'queue length is now 2');

    t.equal(element.with.message, 'one', 'message is "one"');
    t.end();
  });
});

tap.test('take multiple elements from the queue', function (t) {
  queue.get(id, function (err, _queue) {
    t.error(err, 'queue.get called successfully');
    _queue.concurrency = 2;

    queue.update(_queue, function (err, _queue) {
      t.error(err, 'queue.update called successfully');
      var elems;

      queue.take(id, function (err, elems, _queue) {
        t.error(err, 'queue.take called successfully');

        t.equal(_queue.elements.length, 0, 'queue length is now 0');

        t.doesNotThrow(function () {
          t.equal(elems[0].with.message, 'two', 'message is "two"');
          t.equal(elems[1].with.message, 'three', 'message is "three"');
        }, 'take returned 2 elements');

        _queue.concurrency = 1;

        queue.update(_queue, function (err, _queue) {
          t.error(err, 'queue.update called successfully');
          t.end();
        });
      });
    });
  });
});

tap.test('repopulate the queue', function (t) {
  queue.extend(id, [
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

    t.end();
  });
});

tap.test('start the queue and run for 11 seconds', function (t) {
  queue.start(id, function (err, _queue) {
    t.error(err, 'queue starts');
    t.end();
  });
});

tap.test('stop the queue after 11 seconds', function (t) {
  setTimeout(function () {
    queue.stop(id, function (err) {
      t.error(err, 'queue stops');
      t.end();
    });
  }, 11000);
});

tap.test('queue elements processed as expected', function (t) {
  counter.all(function (err, counts) {
    t.error(err, 'no error');

    t.equal(counts.length, 3, '3 elements were processed by the queue');
    t.ok(hasMessage('one'), 'first job was executed');
    t.ok(hasMessage('two'), 'second job was executed');
    t.ok(hasMessage('three'), 'third job was executed');

    queue.get(id, function (err, _queue) {
      t.error(err, 'successfully got queue');
      t.equal(_queue.elements.length, 3, 'queue has 3 elements');
      t.doesNotThrow(function () {
        t.equal(_queue.elements[0].with.message, 'one', 'first job is now first in queue');
        t.equal(_queue.elements[1].with.message, 'two', 'second job is now second in queue');
        t.equal(_queue.elements[2].with.message, 'three', 'third job is now third in queue');
      }, 'queue elements have expected properties');
      t.end();
    });

    function hasMessage(msg) {
      return counts.some(function (c) {
        return c.message === msg;
      });
    }
  });
});

tap.test('destroy all counter documents', function (t) {
  t.plan(4);

  counter.all(function (err, counts) {
    t.error(err, 'no error');

    counts.forEach(function (c) {
      counter.destroy(c.id, function (err) {
        t.error(err, 'destroyed ' + c.id);
      });
    });
  });
});

tap.test('modify the queue while it is running', function (t) {

  //
  // Couchdb is most likely to cause collision problems
  //
  resource.queue.persist('couchdb');

  resource.queue.updateOrCreate(id, function (err, _queue) {
    t.error(err, 'no error');

    var els = _queue.elements.slice();

    queue.start(id, function (err, _queue) {
      t.error(err, 'queue starts');

      setTimeout(function () {
        //
        // Request the couchdb document
        //
        request({
          uri: 'http://localhost:5984/big/queue%2Ftest-queue',
          json: true
        }, function (err, res, body) {
          t.error(err, 'no error requesting document');

          //
          // Modify the document
          //
          body.elements = els;

          request({
            method: 'POST',
            uri: 'http://localhost:5984/big/queue%2Ftest-queue',
            json: body
          }, function (err, res) {
            t.error(err, 'no error modifying document');
            setTimeout(function () {
              queue.stop(id, function (err, _queue) {
                t.error(err, 'queue stops');
                t.end();
              });
            }, 5000);
          });
        });
      }, 6000);
    });
  });
});

tap.test('push to the queue while it is running', function (t) {
  queue.get(id, function (err, _queue) {
    t.error(err, 'no error while getting queue');

    _queue.elements = [];

    queue.update(_queue, function (err, _queue) {
      t.error(err, 'no error while updating queue');

      queue.start(id, function (err, _queue) {
        t.error(err, 'queue starts');

        setTimeout(function () {
          resource.queue.get(id, function (err, _queue) {
            t.error(err, 'no error while getting queue');

            queue.push(id, {
              method: 'counter::create',
              with: { timestamp: new Date(), message: 'four' }
            }, function (err, _queue) {
              t.error(err, 'no error while pushing to queue');

              setTimeout(function () {
                queue.get(id, function (err, _queue) {
                  t.error(err, 'no error while getting queue');

                  queue.stop(id, function (err, _queue) {
                    t.error(err, 'queue stops');
                    t.end();
                  });
                });
              }, 5000);
            });
          });
        }, 6000);
      });
    });
  });
});
