var resource = require('resource'),
    config = resource.define('config');

var _persist = config.persist,
    engine;

config.schema.description = "configuration management for resources";

config.persist = function (opts) {
  if (typeof opts === 'string') {
    engine = opts;
  }
  else if (opts.type) {
    engine = opts.type;
  }
  return _persist(opts);
};

config.persist('fs');

config.method('start', start, {
  "description": "load configuration options",
  "properties": {
    "id": {
      "type": "any"
    },
    "callback": {
      "type": "function"
    }
  }
});
function start(id, callback) {
  if (!callback && typeof id === 'function') {
    callback = id;
    id = resource.env;
  }

  config.get(id, function (err, conf) {
    if (err) {
      if (err.message.match(/not found/) && id !== 'development') {
        resource.logger.warn('Could not find `' + id + '` configuration');
        resource.logger.warn('Falling back to `development `configuration');
        return config.get('development', finish);
      }
      return callback(err);
    }
    finish(null, conf);
  });

  function finish(err, conf) {
    if (err) {
      return callback(err);
    }
    config.attach(conf, callback);
  }
};

//
// Attach properties from a conf object to the config resource
// This is written with after hooks in mind
//
config.method('attach', attach, {
  "description": "Attach configuration options to the config resource",
  "properties": {
    "options": {
      "type": "object"
    },
    "callback": {
      "type": "function"
    }
  }
});
function attach(conf, callback) {
  var path = require('path');

  var err = null;
  try {
    //
    // Hack to get the full config
    //
    if (engine === 'fs') {
      conf = require(path.join(resource.helper.appDir, 'db', 'config', conf.id + '.json'));
    }

    Object.keys(conf).forEach(function (k) {
      config[k] = conf[k];
    });
  }
  catch (e) {
    err = e;
  }
  callback(err, conf);
}

exports.config = config;
