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

  //
  // Map uuid library to persistence resource
  //
  persistence.uuid = require('node-uuid');

  resource.use(options.type);
  resource.resources[options.type].start(function() {
    return resource.resources[options.type].enable(r, options);
  });
}

persistence.dependencies = {
  "node-uuid": "*"
};

exports.persistence = persistence;