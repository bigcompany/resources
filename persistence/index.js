var resource = require('resource'),
    persistence = resource.define('persistence');

persistence.schema.description = "enables persistence for resources";

persistence.method('enable', enable);

function enable (r, options) {

<<<<<<< HEAD
  if(typeof options === "string") {
    options = {
      type: options
    };
  }

  //
  // Map uuid library to persistence resource
  //
  persistence.uuid = require('node-uuid');

  var _type = options.type || 'fs';

  resource.use(_type);
  resource.resources[_type].start(function() {
    return resource.resources[_type].enable(r, options);
  });
}

persistence.dependencies = {
  "node-uuid": "*"
};

exports.persistence = persistence;
