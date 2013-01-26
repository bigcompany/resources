//
// The mesh allows big to communicate with other big instances
//
var resource = require('resource'),
    mesh = resource.define('mesh');

mesh.schema.description = "provides a distributed p2p event emitter mesh";

resource.use('node', { datasource: 'fs' });
resource.use('system');

/*

TODO: mesh events should bubble up to the mesh resource itself

var EventEmitter = require('eventemitter2').EventEmitter2;

var ee = new EventEmitter({
  wildcard: true, // event emitter should use wildcards ( * )
  delimiter: '::', // the delimiter used to segment namespaces
  maxListeners: 20, // the max number of listeners that can be assigned to an event
});
mesh.emit = ee.emit;
mesh.on = ee.on;
mesh.onAny = ee.onAny;

*/


mesh.method('connect', connect, {
  "description": "connect to the big mesh",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "port": resource.node.schema.properties['port'],
        "host": resource.node.schema.properties['host']
      }
    },
    "callback": {
      "description": "the callback executed after connecting to mesh",
      "type": "function",
      "required": false
    }
  }
});

mesh.method('listen', listen, {
  "description": "listens for incoming nodes",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "port": resource.node.schema.properties['port'],
        "host": resource.node.schema.properties['host']
      }
    },
    "callback": {
      "description": "the callback executed after connecting to mesh",
      "type": "function",
      "required": false
    }
  }
});

mesh.method('downlink', downlink, {
  "description": "when an incoming node connection has been made",
  "private": true,
  "properties": {
    "options": {
      "type": "object"
    },
    "callback": {
      "description": "the callback executed after connecting to mesh",
      "type": "function",
      "required": false
    }
  }
});

mesh.method('uplink', uplink, {
  "description": "when an outgoing node connection has been made",
  "properties": {
    "options": {
      "type": "object"
    },
    "callback": {
      "description": "the callback executed after connecting to mesh",
      "type": "function",
      "required": false
    }
  },
  "private": true
});


function downlink (socket, callback) {
  socket.on('message', function(data){
    var msg = JSON.parse(data);
    msg.payload.id = socket.id;
    //
    // TODO: figure out where engine.io is storing remoteAddress on socket !!!
    //
    //msg.payload.host = socket.remoteAddress.host;
    //msg.payload.port = socket.remoteAddress.port;
    resource.emit(msg.event, msg.payload, false)
  });

  socket.on('disconnect', function(data){
    resource.node.create({
      id: socket.id,
      lastSeen: new Date().toString(),
      role: "client",
      status: "disconnected"
    }, function(err, node){});
  });

  //
  // Continue with information about the socket
  //
  callback(null, {
    id: socket.id,
    lastSeen: new Date().toString(),
    role: "client",
    status: "connected"
  });

}

function uplink (options, callback) {

  //
  // Any mesh client events should be rebroadcasted locally,
  // but they should not be re-emitted
  //
  mesh.client.on('message', function(data){
    var msg = JSON.parse(data);
    console.log('uplink sending', msg)
    resource.emit(msg.event, msg.payload, false)
  })

  //
  // Send a friendly phone-home message
  // Feel free to comment this line out at any time
  //
  mesh.client.send(JSON.stringify({ event: 'node::ohai', payload: resource.system.info() }));

  //
  // Continue with information about the newly connected to node
  //
  callback(null, {
    id: options.host + ":" + options.port,
    port: options.port,
    host: options.host,
    status: "connected",
    lastSeen: new Date().toString(),
    role: "server"
  });

}

//
// Connects to a Big mesh to broadcast and listen for events
//
function connect (options, callback) {
  //
  // Since the mesh is just now connecting, set all previous uplink nodes to disconnected
  //
  var uplinks = 0;
  resource.node.find({ status: 'connected' }, function(err, results) {
    if(results.length === 0) {
      return _connect();
    }
    results.forEach(function(record) {
      record.status = "disconnected";
      record.save(function() {
        uplinks++;
        if(uplinks === results.length) {
          _connect();
        }
      })
    });
  });

  function _connect () {
    var client = require('engine.io-client');
    mesh.client = new client.Socket({ host: options.host, port: options.port });
    mesh.client.on('error', function (err) {
      return callback(err);
    });
    mesh.client.on('open', function(){
      mesh.uplink(options, callback);
    });
  }
};

function listen (options, callback) {
  var engine = require('engine.io');
  if(typeof resource.http.server !== 'object') {
    console.log('cold not find http')
  }
  //
  // Remark: mesh.server is the same as http.server
  //
  mesh.server = engine.attach(resource.http.server);
  mesh.server.on('connection', function(socket){
    mesh.downlink(socket, function(err, result){
      if (err) {
        throw err;
      }
    });
  });
  callback(null, mesh.server);
};

exports.dependencies = {
  "engine.io": "0.3.9",
  "engine.io-client": "0.3.9",
  "eventemitter2": "*"
};

exports.mesh = mesh;