var resource = require('resource'),
    bitcoin_lib = require('bitcoin'),
    bitcoin = resource.define('bitcoin'),
    commands = require(require.resolve('bitcoin') + '/../commands');

bitcoin.schema.description = "for managing bitcoins";

bitcoin.property('server', {
  description: 'a bitcoin server',
  properties: {
    host: {
      description: 'the hostname of the bitcoin server',
      type: 'string',
      default: 'localhost'
    },
    port: {
      description: 'the port of the bitcoin server',
      type: 'number',
      default: 8332
    },
    user: {
      description: 'the user of the bitcoin server',
      type: 'string',
      default: 'rpcuser'
    },
    pass: {
      description: 'the password of the bitcoin server',
      type: 'string',
      default: 'rpcpassword'
    },
    ssl: {
      description: 'whether to enable ssl on bitcoin server',
      type: 'boolean',
      default: false
    }
  }
});

//
// A lookup table of bitcoin connections
//
bitcoin.connections = {};

bitcoin.method('connect', connect, {
  description: 'connects to a bitcoin server',
  properties: {
    options: {
      type: 'object',
      properties: bitcoin.schema.properties.server.properties
    },
    callback: {
      type: 'function'
    }
  }
});
function connect(options, callback) {
  var connection_id = bitcoin.connection_id(options);
      Client = bitcoin_lib.Client; // bitcoin client class

  // lookup table of bitcoin connections
  bitcoin.connections[connection_id] = {
    id: connection_id
  };

  var client; // bitcoin client instance
  client = bitcoin.connections[connection_id].client = new Client(options);
  // check client status through getInfo()
  client.getInfo(function(err, info) {
    // check for possible errors
    if (err)
    {
      return callback(err, null);
    } else if (info.errors !== '') {
      return callback(info.errors, null);
    }
    // if no errors, return client
    return callback(null, bitcoin.connections[connection_id]);
  });
}

bitcoin.method('connection_id', connection_id, {
  description: 'converts connect info to connection_id',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: bitcoin.schema.properties.server.properties.host,
        port: bitcoin.schema.properties.server.properties.port,
        user: bitcoin.schema.properties.server.properties.user
      }
    },
    callback: {
      type: 'function'
    }
  }
});
function connection_id(options, callback) {
  return [options.host, options.port, options.user].join(':');
}

Object.keys(commands).forEach(function(command) {
  // define resource method for library command
  bitcoin.method(command, function(connection_id, args, callback) {
    // get client for connection_id
    var client = bitcoin.connections[connection_id].client;
    // add callback to end of args
    args.push(callback);
    // call client command with args
    client[command].apply(client, args);
  });
});

exports.bitcoin = bitcoin;
exports.dependencies = {
  "bitcoin": "1.7.0"
};
