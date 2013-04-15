var resource = require('resource'),
    config = resource.define('config');

config.persist('fs');

config.after('create', attach);
config.after('get', attach);
config.after('update', attach);
config.after('updateOrCreate', attach);

//
// Ideally, we would use config.get with a default id, but this does not work
// because calling get(callback) ends up with the id being set to the callback
// and the callback not being set at all. Using the schema to insist that
// the id is a string causes get to error on validation.
//
config.method('load', load, {
  description: 'Load the default configuration for this application',
  properties: {
    callback: {
      type: 'function'
    }
  }
});
function load(callback) {
  //
  // Remark: In order for the config to load properly, you currently need to
  // set the expected properties on config, and then re-persist it. This is
  // a problem. I see two solutions: Either attempt to make the fs adapter
  // for jugglingdb not scrub properties, or write a custom get function.
  // Combined with the call signature issues with get, writing a custom get
  // may be the best solution.
  //
  if (resource.isProduction) {
    return config.get('production', callback);
  }
  return config.get('development', callback);
}

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
  var err = null;
  try {
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
