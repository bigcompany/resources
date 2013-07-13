var resource = require('resource'),
    persistence = resource.define('persistence');

persistence.schema.description = "enables persistence for resources";

persistence.method('enable', enable);

function enable (r, options) {

  if(typeof options === "string") {
    options = {
      type: options
    };
  }

  resource.use(options.type);
  resource.resources[options.type].start(function() {
    return resource.resources[options.type].enable(r, options);
  });
}

persistence.dependencies = {};

exports.persistence = persistence;