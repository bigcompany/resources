var resource = require('resource'),
    config = resource.define('config');

config.persist('fs');

config.after('create', attach);
config.after('get', attach);
config.after('update', attach);
config.after('updateOrCreate', attach);

//
// This way, if you do config.get(function (err, conf) {}) it will default
// to either "development" or "production"
//
// TODO: Is there something more clever we can do here?
//
if (resource.isDevelopment) {
  config.get.schema.properties.id.default = 'development';
}

if (resource.isProduction) {
  config.get.schema.properties.id.default = 'production';
}

//
// Attach properties from a conf object to the config resource
// This is written with after hooks in mind
//
// TODO: Expose as a resource method
//
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

// var originalProperties = Object.keys(config); // Use for scrubbing config?
// config.before('destroy', detach);

//
// Clean up resource.config by passing the config object in you wish to "detach"
// This is written with before hooks in mind
//
// TODO: Expose as a resource method
//
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
