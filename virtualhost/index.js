var resource = require('resource'),
    virtualhost = resource.define('virtualhost');

virtualhost.schema.description = "provides virtual hosts";

virtualhost.property('host');
virtualhost.property('path');

exports.virtualhost = virtualhost;