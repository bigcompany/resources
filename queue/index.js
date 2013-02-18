var resource = require('resource'),
    queue = resource.define('queue');

queue.persist('memory');

queue.property('concurrency', {
  description: 'how many jobs to run at once',
  type: 'number',
  default: 1
});

queue.property('interval', {
  description: 'time interval between processing items (ms)',
  type: 'number',
  default: 5000
});

queue.property('wait', {
  description: 'wait until all running jobs are completed before executing next set',
  type: 'boolean',
  default: true
});

queue.property('repeat', {
  description: 'automatically push completed elements back onto the queue',
  type: 'boolean',
  default: false
});

queue.property('autosave', {
  description: 'automatically save the queue after a processing step',
  type: 'boolean',
  default: true
});

queue.property('elements', {
  description: 'the elements currently inside the queue',
  type: 'array',
  default: []
});

//
// Basic push/shift methods for queue
//
// Remark: Typically, array shifts are considered expensive, and there is
// a way to optimize this by offsetting the index instead of shifting,
// reusing earlier elements in the array, and then resizing the array (only
// here would slicing be used) and resetting the offsets when the array becomes
// full. That said, this is probably negligible compared to the overhead of
// persisting the queue to a datasource anyway.
//
queue.method('push', push, {
  description: 'push an element onto the queue',
  properties: {
    queue: queue.schema,
    job: {
      properties: {
        method: {
          type: 'string'
        },
        with: {
          type: 'any',
          default: {}
        }
      }
    }
  }
});
function push(q, job) {
  return q.elements.push(job);
}

queue.method('shift', shift, {
  description: 'shift an element off the queue',
  properties: {
    options: {
      properties: queue.schema.properties
    }
  }
});
function shift (q) {
  return q.elements.shift();
}

queue.method('take', take, {
  description: 'take `n` elements off the queue',
  properties: {
    options: {
      properties: queue.schema.properties
    },
    n: {
      type: 'number',
      default: 1
    }
  }
});
function take (q) {
  var n = q.concurrency;
  var xs = [];
  //
  // We do this instead of a concat because q is actually a different object
  // and not a direct reference. However, the underlying array methods are still
  // bound to the original argument.
  //
  // This should probably be considered a bug in the resource engine.
  //
  while (n && q.elements.length) {
    var elem = q.elements.shift();
    xs.push(elem);
    n--;
  }

  return xs;
}

//
// Lists in python have an analogous method of the same name
// http://docs.python.org/2/library/stdtypes.html#typesseq-mutable
//
queue.method('extend', extend, {
  description: 'extend the queue with an array of elements',
  properties: {
    instance: {
      properties: queue.schema.properties
    },
    elems: {
      type: 'any'
    }
  }
});
function extend(q, xs) {
  //
  // This method suffers the same problems with modifying objects in-place,
  // as explained in the `take` method. Here, we get around this in a
  // similar technique.
  //
  xs.forEach(function (elem) {
    q.elements.push(elem);
  });

  return q.elements;
}


//
// Run a single job by executing the specified method with the specified
// metadata
//
queue.method('run', run, {
  description: 'run a job',
  type: 'object',
  properties: {
    job: {
      properties: {
        method: {
          type: 'string',
          required: true
        },
        with: {
          type: 'any',
          default: {}
        }
      }
    },
    callback: {
      type: 'function'
    }
  }
});
function run(j, callback) {

  var properties = j.method.split('::'),
      method = resource,
      err;

  properties.forEach(function (p) {
    if (typeof method[p] !== 'undefined') {
      method = method[p];
    }
    else if (!err) {
      err = new Error('could not execute method `' + j.method + '`');
    }
  });

  if (typeof method == 'undefined' ) {
    err = new Error('could not execute method `' + j.method + '`');
  }

  if (err) {
    return callback(err);
  }

  method(j.with, callback);
}

//
// This method takes q.concurrency elements off the front of the queue and
// `queue.run`s them.
//
queue.method('process', process, {
  description: 'process elements off the queue',
  properties: {
    options: queue.schema,
    callback: {
      type: 'function'
    }
  }
});
function process (q, callback) {
  //
  // Process the top q.concurrency elements at once. Compatible with
  // async.forEach
  //
  var elements = queue.take(q, q.concurrency);

  if (!elements.length) {
    return callback();
  }

  var i = elements.length,
          error;

  elements.forEach(function (elem) {
    if (!error) {
      queue.run(elem, function (err) {
        if (err) {
          callback(err);
          error = err;
          return;
        }

        i--;

        if (!i) {
          finish();
        }
      });
    }
  });

  function finish () {
    //
    // If element repeating is turned on, concat the just-processed elements
    // back onto the queue
    //
    if (q.repeat && elements.length) {
      queue.extend(q, elements);
    }

    //
    // If autosave is turned on, save the current queue.
    //
    if (q.autosave) {
      queue.updateOrCreate(q, function (err, _q) {
        if (err) {
          return callback(err);
        }
        callback(null, _q);
      });
    }
    else {
      callback(null, q);
    }
  }
}

//
// TODO: `unload` method
//
queue.method('load', load, {
  description: 'start processing a queue',
  properties: {
    options: queue.schema
  }
});
function load(q) {
  _process();

  function _process() {
    var completed = false,
        timedOut = false;

    //
    // Process again at the end of the timeout *if* the last process step
    // completed
    //
    setTimeout(function () {
      //
      // If waiting is turned off, always process the next set of elements
      //
      if (completed || !q.wait) {
        _process();
      }
      else {
        timedOut = true;
      }
    }, q.interval);

    queue.process(q, function (err, result) {
      if (err) {
        //
        // Remark: Emit error, keep going (for now, may change behavior)
        //
        // TODO: Attach some context to the error?
        //
        queue.emit('error', err);
      }

      completed = true;

      //
      // If the timeout occurred while the process step was still running,
      // execute it late
      //
      if (timedOut) {
        _process();
      }
    });
  }
}

queue.on('error', function (error, data) {
  resource.logger.error(error);
  resource.logger.data(data);
});

//
// after hooks to add methods to instances of queue
//
queue.after('create', addMethods);
queue.after('get', addMethods);
queue.after('updateOrCreate', addMethods);
queue.after('all', addMethods);
queue.after('find', addMethods);
function addMethods (instance, next) {
  //
  // In cases of 'all' and 'find', "instance" will actually be an *array* of
  // queue instances.
  //
  if (Array.isArray(instance)) {
    //
    // Use "some" to short
    //
    instance.some(function (q, i) {
      var err;
      //
      // Remark: addMethods runs synchronously
      //
      addMethods(q, function (e, _q) {
        if (e) {
          err = e;
          return;
        }
        instance[i] = _q;
      });

      if (err) {
        next(err);
      }

      //
      // If err is truthy, this will short-circuit the .some method
      //
      return err;
    });

    return next(null, instance);
  }

  //
  // Assuming instance is *not* an array, add all the bound methods to
  // the instance
  //
  [
    'push',
    'shift',
    'take',
    'extend',
    'process',
    'load'
  ].forEach(function (m) {
    instance[m] = queue[m].bind(queue, instance);
  });

  //
  // Alias "start" to "load" at the instance level
  //
  instance.start = instance.load;

  next(null, instance);
}

exports.queue = queue;
