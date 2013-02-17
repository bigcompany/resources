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

queue.property('queue', {
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
          type: 'object',
          default: {}
        }
      }
    }
  }
});
function push(q, job) {
  return q.queue.push(job);
}

queue.method('shift', shift, {
  description: 'shift an element off the queue',
  properties: {
    options: {
      properties: queue.schema.properties
    }
  }
});
function shift(q) {
  return q.queue.shift();
}

queue.method('take', take, {
  description: 'take `n` elements off the queue',
  properties: {
    options: {
      properties: queue.schema.properties
    },
    n: { type: 'number' }
  }
});
function take(q, n) {
  var xs = q.queue.slice(0, n);
  q.queue = q.queue.slice(n);
  return xs;
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
          type: 'string'
        },
        with: {
          type: 'object',
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
function process(q, callback) {
  var async = require('async');

  var js = queue.take(q, q.concurrency);

  //
  // Run the slice of jobs concurrently
  //
  async.forEach(js, queue.run, function (err) {
    callback(err, q);
  });
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

exports.queue = queue;
exports.dependencies = {
  "async": "*"
};
