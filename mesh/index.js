//
// The mesh allows big to communicate with other big instances
//
var resource = require('resource'),
    mesh = resource.define('mesh');

mesh.schema.description = "distributed p2p event emitter mesh";

resource.use('node', { datasource: 'fs' });
resource.use('system');

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

mesh.method('connected', connected, {
  "description": "succesffuly connected to a big mesh ",
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

function connected (options, callback) {

    //
    // Any mesh client events should be rebroadcasted locally,
    // but they should not be re-emitted
    //
    mesh.client.on('message', function(data){
      var msg = JSON.parse(data);
      resource.emit(msg.event, msg.payload, false)
    })

    /*

       Working, but commented out for now.
       Should should make this configurable or move it somewhere else

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
    */

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

};

mesh.method('connection', function connection (socket, callback) {

    /*
    ///
    // On new connections, create a new node to represent the connection
    //
    resource.node.create({
      id: socket.id,
      lastSeen: new Date().toString(),
      role: "client",
      status: "connected"
    }, function(err, node){});
    */
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

    //
    // Continue with information about the socket
    //
    callback(null, {
      id: socket.id,
      lastSeen: new Date().toString(),
      role: "client",
      status: "connected"
    });

});

//
// Connects to a Big mesh to broadcast and listen for events
//
function connect (options, callback) {
  var client = require('engine.io-client');
  mesh.client = new client.Socket({ host: options.host, port: options.port });
  mesh.client.on('error', function (err) {
    console.log(err)
    callback(err);
  });
  mesh.client.on('open', function(){
    mesh.connected(options, callback);
  });
};

function listen (options, callback) {
  var engine = require('engine.io');
  mesh.server = engine.attach(resource.http.server);
  mesh.server.on('connection', mesh.connection);
};

exports.dependencies = {
  "engine.io": "*",
  "engine.io-client": "*"
};

exports.mesh = mesh;