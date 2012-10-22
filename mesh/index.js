//
// The mesh allows big to communicate with other big instances
//
var resource = require('resource'),
    mesh = resource.define('mesh');

mesh.schema.description = "distributed p2p event emitter mesh";

resource.use('node', { datasource: 'fs' });
resource.use('system');

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
  "private": true
});

mesh.method('uplink', uplink, {
  "description": "when an outgoing node connection has been made",
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

function uplink (options, client, callback) {

  //
  // Any mesh client events should be rebroadcasted locally,
  // but they should not be re-emitted
  //
  mesh.client.on('message', function(data){
    var msg = JSON.parse(data);
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

  var client = require('engine.io-client');
  mesh.client = new client.Socket({ host: options.host, port: options.port });
  mesh.client.on('error', function (err) {
    console.log('error', err)
    return callback(err);
  });

  mesh.client.on('open', function(){
    mesh.uplink(options, client, callback);
  });

};

function listen (options, callback) {
  var engine = require('engine.io');
  mesh.server = engine.attach(resource.http.server);
  mesh.server.on('connection', mesh.downlink);
};

exports.dependencies = {
  "engine.io": "*",
  "engine.io-client": "*"
};

exports.mesh = mesh;