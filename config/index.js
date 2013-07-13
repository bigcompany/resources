var resource = require('resource'),
    config = resource.define('config');

var _persist = config.persist,
    engine;

config.schema.description = "configuration management for resources";

config.property('data', { type: 'object' });

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
      return callback(err);
    }
    config.attach(conf, callback);
  });
}

config.method('attach', attach);

function attach(conf, callback) {
  Object.keys(conf.data).forEach(function (k) {
    //
    // Attach config.data properties to config resource scope
    //
    config[k] = conf.data[k];
    //
    // If an object value is detected, check to see if the key is a resource exists with that property name,
    // If so, assign that value to resource.config.value
    //
    if (typeof conf.data[k] === 'object') {
      if (typeof resource.resources[k] === 'object') {
        for (var v in conf.data[k]) {
          resource.resources[k].config = resource.resources[k].config || {};
          resource.resources[k].config[v] = conf.data[k][v];
        }
      }
    }
  });
  callback(null, conf);
}

exports.config = config;