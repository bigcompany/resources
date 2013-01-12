var resource  = require('resource'),
    replication = resource.define('replication');

replication.schema.description = "for managing and keeping track of replication events";

replication.persist('memory');

replication.property('time', {
  "description": "the date and time of the replication",
  "type": "string",
  "default": new Date().toString()
});

replication.property('source', {
  "description": "the source of the replication ( where the code is coming from )",
  "type": "string"
});

replication.property('target', {
  "description": "the target of the replication ( where the code is going )",
  "type": "string"
});

replication.property('repo', {
  "type": "string"
});

replication.property('branch', {
  "type": "string"
});

exports.replication = replication;
