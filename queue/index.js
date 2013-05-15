var resource = require('resource'),
    queue = resource.define('queue');

queue.schema.description = "a queue for resource events";

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

queue.property('elements', {
  description: 'the elements currently inside the queue',
  type: 'array',
  default: []
});

queue.property('started', {
  description: 'whether or not the queue has been started',
  type: 'boolean',
  default: false
});

queue.property('inProgress', {
  description: 'the elements currently being processed',
  type: 'array',
  default: []
});


//
// Basic push/shift methods for queue
//
queue.method('push', push, {
  description: 'push an element onto the queue',
  properties: {
    id: { type: 'any' },
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
    },
    callback: {
      type: 'function',
      default: function (err, _queue) {
        if (err) {
          queue.emit('error', err, _queue);
        }
      }
    }
  }
});
function push (id, job, callback) {
  modify(id, function (_queue) {
    _queue.elements.push(job);
    return _queue;
  }, callback);
}

queue.method('shift', shift, {
  description: 'shift an element off the queue',
  properties: {
    id: { type: 'any' },
    callback: {
      type: 'function',
      default: function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }
    }
  }
});
function shift (id, callback) {
  var shifted;
  modify(id, function (_queue) {
    shifted = _queue.elements.shift();
    return _queue;
  }, function (err, _queue) {
    callback(err, shifted, _queue);
  });
}

queue.method('unshift', unshift, {
  description: 'unshift an element onto the front of the queue',
  properties: {
    id: { type: 'any' },
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
    },
    callback: {
      type: 'function',
      default: function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }
    }
  }
});
function unshift (id, job, callback) {
  modify(id, function (_queue) {
    _queue.elements.unshift(job);
    return _queue;
  }, callback);
}

//
// TODO: Should this take argument 'n' ?
//
queue.method('take', take, {
  description: 'take `queue.concurrency` elements off the queue',
  properties: {
    id: { type: 'any' },
    callback: {
      type: 'function',
      default: function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }
    }
  }
});
function take (id, callback) {
  var xs;
  modify(id, function (_queue) {
    var n = _queue.concurrency;
    xs = _queue.elements.slice(0, n);
    _queue.elements = _queue.elements.slice(n);
    return _queue;
  }, function (err, _queue) {
    callback(err, xs, _queue);
  });
}

//
// Lists in python have an analogous method of the same name
// http://docs.python.org/2/library/stdtypes.html#typesseq-mutable
//
queue.method('extend', extend, {
  description: 'extend the queue with an array of elements',
  properties: {
    id: { type: 'any' },
    elems: {
      type: 'any'
    },
    callback: {
      type: 'function',
      default: function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }
    }
  }
});
function extend(id, xs, callback) {
  modify(id, function (_queue) {
    _queue.elements = _queue.elements.concat(xs);
    return _queue;
  }, callback);
}

var modifications = [],
    modifier = null;
function modify(id, fn, callback) {
  modifications.push(function () {
    queue.get(id, function (err, _queue) {
      if (err) {
        return callback(err);
      }
      queue.update(fn(_queue), function (err, _queue) {
        if (modifier) {
          modifier();
        }
        callback(err, _queue);
      });
    });
  });

  if (!modifier) {
    modifier = function () {
      if (modifications.length) {
        modifications.shift()();
      }
      else {
        modifier = null;
      }
    }
    modifier();
  }
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
queue.method('process', processQueue, {
  description: 'process elements off the queue',
  properties: {
    id: { type: 'any' },
    callback: {
      type: 'function',
      required: true
    }
  }
});
function processQueue (id, callback) {
  queue.take(id, function (err, elems, _queue) {
    if (err) {
      return callback(err);
    }

    if (!elems.length) {
      return callback();
    }

    modify(id, function (_queue) {
      _queue.inProgress = elems;
      return _queue;
    }, function (err, _queue) {
      if (err) {
        queue.emit('error', err);
      }

      var i = elems.length;

      elems.forEach(function (elem, j) {
        queue.run(elem, function (err) {
          i--;

          if (err) {
            queue.emit('error', err);
          }

          modify(id, function (_queue) {
            _queue.inProgress[j] = null;
            return _queue;
          }, function (_err, _queue) {
            if (_err) {
              queue.emit('error', _err);
            }

            if (_queue.repeat && !err) {
              queue.push(id, elem, next);
            }
            else {
              next(null, _queue);
            }

            function next(err, _queue) {
              if (err) {
                queue.emit('error', err);
              }

              if (i <= 0) {
                modify(id, function (_queue) {
                  _queue.inProgress = [];
                  return _queue;
                }, callback);
              }
              else {
                callback(null, _queue);
              }
            }

          });
        });
      });
    });
  });
}

queue.method('start', start, {
  description: 'start processing a queue',
  properties: {
    id: { type: 'any' },
    callback: {
      type: 'function',
      default: function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }
    }
  }
});
function start(id, callback) {

  modify(id, function (_queue) {
    _queue.started = true;
    return _queue;
  }, function (err, _queue) {
    if (err) {
      queue.emit('error', err);
    }

    if (_queue.inProgress.length) {
      var i = _queue.inProgress.length;

      _queue.inProgress.forEach(function (elem) {
        if (elem !== null) {
          queue.unshift(id, elem, function (err, _queue) {
            if (err) {
              queue.emit('error', err);
            }
            complete();
          });
        }
        else {
          complete();
        }

        function complete() {
          i--;
          if (i === 0) {
            modify(id, function (_queue) {
              _queue.inProgress = [];
              return _queue;
            }, function (err, _queue) {
              if (err) {
                queue.emit('error', err);
              }
              _process();
            });
          }
          else {
            _process();
          }
        }
      });
    }
    else {
      _process();
    }

    callback(null, _queue);

    function _process() {
      var completed = false,
          timedOut = false;

      queue.get(id, function (err, _queue) {
        if (_queue.started) {
          //
          // Process again at the end of the timeout *if* the last process step
          // completed
          //
          setTimeout(function () {
            //
            // If waiting is turned off, always process the next set of elements
            //
            if (_queue.started && (completed || !_queue.wait)) {
              _process();
            }
            else {
              timedOut = true;
            }
          }, _queue.interval);

          queue.process(id, function (err, result) {
            if (err) {
              queue.emit('error', err);
            }

            completed = true;

            //
            // If the timeout occurred while the process step was still running,
            // execute it late
            //
            if (timedOut && _queue.started) {
              _process();
            }
          });
        }
      });
    }
  });
}

queue.method('stop', stop, {
  description: 'start processing a queue',
  properties: {
    id: { type: 'any' },
    callback: {
      type: 'function',
      default: function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }
    }
  }
});
function stop(id, callback) {
  modify(id, function (_queue) {
    _queue.started = false;
    return _queue;
  }, callback);
}

process.nextTick(function () {
  if (!queue.listeners('error').length) {
    queue.on('error', function (err) {
      resource.logger.error('Error while processing queue:');
      resource.logger.error(err);
    });
  }
});
exports.queue = queue;
