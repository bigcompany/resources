var resource = require('resource'),
    bitcoin_lib = require('bitcoin'),
    bitcoin = resource.define('bitcoin');

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
      default: 80
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
bitcoin.connections = {}

bitcoin.method('connect', connect, {
  description: 'connects to a bitcoin server',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: bitcoin.schema.properties.server.properties.host,
        port: bitcoin.schema.properties.server.properties.port,
        user: bitcoin.schema.properties.server.properties.user,
        pass: bitcoin.schema.properties.server.properties.pass,
        ssl: bitcoin.schema.properties.server.properties.ssl
      }
    },
    callback: {
      type: 'function'
    }
  }
});
function connect(options, callback) {
  var tuple = [options.host, options.port, options.user].join(':'),
      Client = require('bitcoin').Client, // bitcoin client class
      client; // bitcoin client instance

  bitcoin.connections[tuple] = {};
  /*client = bitcoin.connections[tuple].client = Client({
    host: options.host,
    port: options.port,
    user: options.user,
    pass: options.pass
  });*/
  bitcoin.connections[tuple].client = options;
  return callback(null, bitcoin.connections[tuple]);
}

console.log(bitcoin);

exports.bitcoin = bitcoin;
exports.dependencies = {
  "bitcoin": "1.7.0"
};
