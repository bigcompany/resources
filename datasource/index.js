var resource = require('resource'),
    datasource = resource.define('datasource');

datasource.schema.description = "perists resources to data storage engines";

datasource.persist('memory');

datasource.property('status', {
  type: "string",
  description: "the status of the datasource",
  enum: ['online', 'offline', 'error'],
  format: 'status',
  default: "offline"
});

datasource.property('type', {
  type: "string",
  description: "The type of the datasource",
  enum: ["couch", "fs", "memory", "mongo", "mysql", "redis"],
  required: true,
  message: "datasource type must be valid"
});

datasource.property('port', {
  type: "number",
  description: "the port of the datasource",
  minimum: 1,
  maximum: 65535,
  message: "port should be valid",
});

datasource.property('host', {
  type: "string",
  description: "the host of the datasource",
  format: "host-name",
  minLength: 1,
  default: "localhost",
});

datasource.property('uri', {
  type: "string",
  description: "the connection uri to the datasource",
  default: ""
});

datasource.property('username', {
  type: "string",
  description: "the username used to connect to the datasource"
});

datasource.property('password', {
  type: "string",
  description: "the password used to connect to the datasource",
  format: "password"
});

datasource.method('test', test, {
  description: "tests the status of a datasource by attempting to connect to it",
  properties: {
    "datasource": {
      "description": "the name of the datasource to test",
      "type": "string",
      "key": "datasource",
      "required": true
    }
  }
});

function test (id, callback) {
  //
  // Get the datasource that will be tested
  //
  datasource.get(id, function(err, record){
    if (err) {
      return callback(err);
    }
    //
    // Attempt connection based on type
    //
    var type = record.type,
        result;
    switch (type) {
      case 'memory':
        result = true;
      break;
      case 'fs':
        // TODO: check for existence of fs database location
        result = true;
      break;
      case 'couch':
        // TODO:
        result = false;
      break;
      case 'mongo':
        // TODO:
        result = false;
      break;
      default:
        result = false;
      break;
    }

    if(result === false) {
      record.status = "error"
    } else {
      record.status = "online";
    }
    record.save(callback);

  })
}

exports.datasource = datasource;
