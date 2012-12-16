//
// TODO: Scaffold resource
//

//
// Note: In most cases, resources will be written as node modules.
// This resource is intended for representing the definition of a resource and to create resources at run-time
//

var resourceModule  = require('resource'),
    resource = resourceModule.define('resource');

resource.schema.description = "meta-resource for describing and creating new resources";

resource.property('name', { type: "string" });
resource.property('methods', { type: "object"});
resource.property('schema', { type: "object"});
resource.property('config', { type: "object"});

console.log(resource)

exports.resource = resource;
