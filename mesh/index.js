//
// The mesh allows big to communicate with other big instances
//
var resource = require('resource'),
    mesh = resource.define('mesh');

mesh.schema.description = "distributed p2p event emitter mesh";

//
// Use the node resource for looking up node schemas
//
resource.use('node');

mesh.method('connect', connect, {
  "description": "Connect to the big mesh ",
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
  "description": "Listens for incoming big instances",
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

//
// On start, set all outgoing server nodes to disconnected
//
resource.node.find({ type: 'server', status: 'connected'}, function(err, results){
  results.forEach(function(r){
    r.status = "disconnected";
    r.save(function(err, result){
      console.log(err, result.id, result.status)
    });
  });
});

//
// Connects to a Big mesh to broadcast and listen for events
//
function connect (options, callback) {

  var client = require('engine.io-client');

  resource.use('system');

  mesh.client = new client.Socket({ host: options.host, port: options.port });

  mesh.client.on('error', function (err) {
    console.log(err)
  });

  mesh.client.on('open', function () {

    //
    // If a successful connection to a mesh has been made,
    // store that information locally as a node
    //
    resource.node.create({
      id: options.host + ":" + options.port,
      port: options.port,
      host: options.host,
      status: "connected",
      lastSeen: new Date().toString(),
      role: "server"
    }, function(err, result){
      // console.log(err, result)
    });

    //
    // Any mesh client events should be rebroadcasted locally,
    // but they should not be re-emitted
    //
    mesh.client.on('message', function(data){
      var msg = JSON.parse(data);
      resource.emit(msg.event, msg.payload, false)
    })

    //
    // Any local events, should be re-broadcasted back to mesh,
    // unless reemit === false
    //
    resource.onAny(function(data, reemit) {
      if(reemit !== false) {
        var msg = {
          event: this.event,
          payload: data
        };
        mesh.client.send(JSON.stringify(msg));
      }
    });

    //
    // Send a friendly phone-home method
    // Feel free to comment this line out at any time
    //
    resource.emit('node::ohai', resource.system.info());

  });

};

function listen (options, callback) {

  var engine = require('engine.io');

  mesh.server = engine.attach(resource.http.server);

  mesh.server.on('connection', function (socket) {

    ///
    // On new connections, create a new node to represent the connection
    //
    resource.node.create({
      id: socket.id,
      lastSeen: new Date().toString(),
      role: "client",
      status: "connected"
    }, function(err, node){});
    //resource.emit('mesh::incoming::connection', socket.id);

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
    // Any local events, should be re-broadcasted back to mesh,
    // unless reemit === false
    //
    resource.onAny(function(data, reemit) {
      var msg = {
        event: this.event,
        payload: data
      };
      if(reemit !== false) {
        socket.send(JSON.stringify(msg));
      }
    });

  });

};

exports.dependencies = {
  "engine.io": "*",
  "engine.io-client": "*"
};

exports.mesh = mesh;