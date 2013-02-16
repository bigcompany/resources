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
// TODO: Implement as ring queue?
//
queue.method('push', push, {
  description: 'push an element onto the queue',
  properties: {
    queue: queue.schema,
    job: {
      properties: {
        name: {
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

//
// Exposing a global list of job methods
// TODO: Scope to instances
//
var jobs = {};
queue.method('jobs', addJobs, {
  description: 'expose worker methods',
  properties: {
    jobs: { type: 'object' }
  }
});
function addJobs(js) {
  jobs = js;
  return queue;
}

//
// Run a single job
//
queue.method('run', run, {
  description: 'run a job',
  type: 'object',
  properties: {
    job: {
      properties: {
        name: {
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
  if (!jobs[j.name]) {
    return callback(new Error('could not execute job of type `' + j.method + '`'));
  }

  jobs[j.name](j.with, callback);
}

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

  //
  // TODO: Implement smarter queue push/shift methods
  //
  var js = [];
  while ((js.length < q.concurrency) && q.queue.length) {
    js.push(queue.shift(q));
  }

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

    process(q, function (err, result) {
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
