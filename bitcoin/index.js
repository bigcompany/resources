var resource = require('resource'),
    bitcoin = resource.define('bitcoin');

bitcoin.schema.description = 'for managing bitcoins';

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

function connect(options, callback) {
  var connectId = bitcoin.connectId(options),
      Client = require('bitcoin').Client; // bitcoin client class

  // lookup table of bitcoin connections
  bitcoin.connections[connectId] = {
    id: connectId
  };

  var client; // bitcoin client instance
  client = bitcoin.connections[connectId].client = new Client(options);
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
    return callback(null, bitcoin.connections[connectId]);
  });
}
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

function connectId(options) {
  return [options.host, options.port, options.user].join(':');
}
bitcoin.method('connectId', connectId, {
  description: 'converts connect info to connectId',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: bitcoin.schema.properties.server.properties.host,
        port: bitcoin.schema.properties.server.properties.port,
        user: bitcoin.schema.properties.server.properties.user
      }
    }
  }
});

bitcoin.method('start', function() {

  var commands = require(require.resolve('bitcoin') + '/../commands');

  Object.keys(commands).forEach(function(command) {
    // define resource method for library command
    bitcoin.method(command, function(connectId, args, callback) {
      // get client for connectId
      var client = bitcoin.connections[connectId].client;
      // add callback to end of args
      args.push(callback);
      // call client command with args
      client[command].apply(client, args);
    });
  });

});

bitcoin.dependencies = {
  'bitcoin': '1.7.0'
};

exports.bitcoin = bitcoin;