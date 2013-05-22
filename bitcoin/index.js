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
  var tuple = [options.host, options.port, options.user].join(':');
      Client = bitcoin_lib.Client; // bitcoin client class

  // lookup table of bitcoin connections
  bitcoin.connections[tuple] = {};

  var client; // bitcoin client instance
  client = bitcoin.connections[tuple].client = new Client(options);
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
    return callback(null, bitcoin.connections[tuple]);
  });
}

exports.bitcoin = bitcoin;
exports.dependencies = {
  "bitcoin": "1.7.0"
};
