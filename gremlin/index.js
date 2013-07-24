var resource = require('resource'),
    gremlin = resource.define('gremlin');

var g_utils = require ('./lib/utils.js');

gremlin.schema.description = "provides gremlin graph traversal as a big resource. ";

gremlin.property("javacom", {
  "type": "string",
  "default": "com.tinkerpop.blueprints.impls.orient.OrientGraph",
  "description": "the java com required to connect to your graphdb."
});

gremlin.property("database", {
  "type": "string",
  "default": "remote:localhost:2424/test",
  "description": "the location of your database, can be remote or local."
});

gremlin.property("username", {
  "type": "string",
  "default": "admin",
  "description": "the username for your database."
});

gremlin.property("password", {
  "type": "string",
  "default": "admin",
  "description": "the password for your database."
});


gremlin.method('init', function (cb) {
  // Require node-gremlin
  var g = require("gremlin"),
    T = g.Tokens,
    Direction = g.Direction,
    Type = g.ClassTypes;

  gremlin.g = g;

  return cb();
});


gremlin.method('start', start, {
  "description": "connects to your database.",
  "properties": {
    "options": {
      "properties": {
        "javacom": gremlin.schema.properties['javacom'],
        "database": gremlin.schema.properties['database'],
        "username": gremlin.schema.properties['username'],
        "password": gremlin.schema.properties['password']
      }
    },
    "callback": {
      "description": "the callback executed after database connect",
      "type": "function",
      "required": false
    }
  }
});
function start (options, callback) {
  // Create instance

  try {
    // your code that can throw exception goes here
    var JavaGraph = gremlin.g.java.import(options.javacom);
    var graphDB = new JavaGraph(options.database, options.username, options.password);
    gremlin.g.SetGraph(graphDB);

    // bind objects to resource
    gremlin.graphDB = graphDB;

    return callback(null, true);

  } catch(e) {
    return callback(g_utils.simplifye(e), false);
  }
}

gremlin.method('commit', commit, {
  "description": "saves changes to the database.",
  "properties": {}
});
function commit () {
  return gremlin.graphDB.commitSync();
}


gremlin.method('disconnect', disconnect, {
  "description": "disconnects from database.",
  "properties": {}
});
function disconnect () {
  return gremlin.graphDB.shutdownSync();
}


gremlin.dependencies = {
  "gremlin": "0.1.x"
};

exports.gremlin = gremlin;