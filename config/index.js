var resource = require('resource'),
    config = resource.define('config');

var _persist = config.persist,
    engine;

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

config.after('create', attach);
config.after('get', attach);
config.after('update', attach);
config.after('updateOrCreate', attach);

//
// Redefine the get method to allow for undefined id
//
delete config.get.schema.properties.id.required;

var _get = config.get.unwrapped;

config.method('get', get, config.get.schema);
function get(id, callback) {
  if (!callback && typeof id === 'function') {
    callback = id;
    id;

    if (resource.isProduction) {
      id = 'production';
    }
    else {
      id = 'development';
    }
  }

  return _get(id, callback);
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

//
// Clean up resource.config by passing the config object in you wish to "detach"
// This is written with before hooks in mind
//
config.method('detach', detach, {
  "description": "Detach configuration options from the config resource",
  "properties": {
    "options": {
      "type": "object"
    },
    "callback": {
      "type": "function"
    }
  }
});
function detach(conf, callback) {
  var err = null;
  try {
    Object.keys(conf).forEach(function (k) {
      delete config[k];
    });
  }
  catch (e) {
    err = e;
  }
  callback(err, conf);
}

exports.config = config;
