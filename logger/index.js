var resource = require('resource'),
    util = require('util'),
    logger = resource.define('logger');

var levels = logger.levels = {
  info: 'green',
  data: 'grey',
  warn: 'yellow',
  error: 'red',
  event: 'grey',
  exec: 'grey',
  help: 'cyan',
  hook: 'magenta'
};

//
// logger may be set to silent at anytime by setting logger.silent=true
//
logger.silent = false;

function log (/* level, a, b, c, ... */) {
  var args = [].slice.call(arguments),
      level = args.shift(),
      callback,
      message;

  if (typeof args[args.length - 1] === 'function') {
    callback = args.pop();
  }

  message = util.format.apply(null, args);

  if(!logger.silent) {
    process.stdout.write(level[levels[level]] + ': ' + message + '\n');
  }

  if (callback) {
    callback(null, level + ': ' + message);
  }
  else {
    return message;
  }
}

function hoistLevels (levels) {
  Object.keys(levels).forEach(function(level){
    logger[level] = function (/* a, b, c, ... */) {
      var args = [].slice.call(arguments);
      logger.log.apply(null, [ level ].concat(args));
    }
  });
};

function pad (str, count) {
  for (var i = 0; i < count; i++) {
    str += " ";
  }
  return str;
};

function put (input, callback) {
  if(typeof callback !== "function") {
    callback = function () {};
  }
  //
  // TODO: Print arrays of homogeneous objects in tabular form
  //
  if (Array.isArray(input)) {
    var keys = Object.keys(input[0]);
    input.forEach(function(item){
      logger.data(JSON.stringify(item))
    });
    return callback(null, input);
  }
  logger.data(JSON.stringify(input))
  return callback(null, input);
};

hoistLevels(levels);

//
// Create logger resource
//

logger.schema.description = "a simple STDOUT based logger";
logger.method("log", log, {
  "description": "logs data to STDOUT",
  "properties": {
    "level": {
      "type": "string",
      "default": "info"
    },
    "message": {
      "type": "any"
    }
  }
});

logger.method('put', put);

exports.logger = logger;