var resource = require('resource'),
    memory = resource.define('memory');

memory.schema.description = "enables memory persistence";

exports.memory = memory;