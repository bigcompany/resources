//
// The mesh allows big to communicate with other big instances
//
var resource = require('resource'),
    mesh = resource.define('mesh');

mesh.schema.description = "provides a distributed p2p event emitter mesh";

resource.use('node', { datasource: 'fs' });
resource.use('system');
resource.use('http');

var emit, meshEmitter;
function events() {
  if (emit && meshEmitter) {
    return;
  }

  var EventEmitter = require('eventemitter2').EventEmitter2;

  //
  // Any events emitted on this eventEmitter will be broadcast to the mesh
  // by listeners added by the uplink and downlink methods
  //
  meshEmitter = new EventEmitter({
    wildcard: true,
    delimiter: '::',
    maxListeners: 0
  });

  //
  // When emitting on the mesh resource, also emit to the meshEmitter so that
  // the event is broadcast to other nodes. The standard resource emit is called
  // internally by the mesh resource in order to emit events without
  // broadcasting.
  //
  emit = mesh.emit;
  mesh.emit = function (event, payload) {
    //
    // Emit the event over the mesh
    //
    return meshEmitter.emit(event, payload);

    //
    // Don't do the regular emit ( since its being used to broadcast to the remote mesh scope, not the local mesh scope)
    //
    // return emit(event, payload);
  };
}

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
  events();

  var handler = function (data) {
    socket.send(JSON.stringify({
      event: this.event,
      payload: data
    }));
  };

  meshEmitter.onAny(handler);

  socket.on('message', function(data){
    var msg = JSON.parse(data);
    msg.payload.id = socket.id;
    //
    // TODO: figure out where engine.io is storing remoteAddress on socket !!!
    //
    //msg.payload.host = socket.remoteAddress.host;
    //msg.payload.port = socket.remoteAddress.port;

    //
    // Any mesh client events should be rebroadcasted locally,
    // but they should not be re-emitted
    //
    emit(msg.event, msg.payload, false);
  });

  //
  // TODO: Do a `get` first!
  //
  socket.on('disconnect', function(data){

    meshEmitter.removeListener(handler);

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
  events();

  var handler = function (data) {
    mesh.client.send(JSON.stringify({
      event: this.event,
      payload: data
    }));
  };

  meshEmitter.onAny(handler);

  //
  // Any mesh client events should be rebroadcasted locally,
  // but they should not be re-emitted
  //
  mesh.client.on('message', function(data){
    var msg = JSON.parse(data);
    emit(msg.event, msg.payload, false);
  })

  mesh.client.on('disconnect', function() {
    meshEmitter.removeListener(handler);
  });

  //
  // Send a friendly phone-home message
  // Feel free to comment this line out at any time
  //
  mesh.emit('node::ohai', resource.system.info());

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
  events();

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
  events();

  var engine = require('engine.io');
  if (typeof resource.http.server === 'object') {
    attach();
  }
  else {
    resource.http.listen(options, function (err) {
      if (err) {
        return callback(err);
      }
      attach();
    });
  }

  function attach() {
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
  }
};

mesh.dependencies = {
  "engine.io": "0.3.9",
  "engine.io-client": "0.3.9",
  "eventemitter2": "*"
};

exports.mesh = mesh;