var resource = require('resource'),
    wallet = resource.define('wallet');

wallet.schema.description = 'for managing inventory';

wallet.persist('memory');

wallet.property('fee', {
  description: 'function that appies fee to outgoing transactions',
  type: 'function'
});

wallet.property('account', {
  description: 'token of account in wallet',
  type: 'string'
});

wallet.property('servers', {
  description: 'list of active wallet servers',
  type: 'array',
  items: {
    type: 'string'
  },
  uniqueItems: true
});

function connect(_wallet, options, callback) {
  // use bitcoin resource
  var bitcoin = resource.use('bitcoin');
  bitcoin.start();
  // connect to bitcoin server
  bitcoin.connect(options, function(err, conn) {
    if (err) {
      throw err;
    }
    // if no servers already
    if (!_wallet.servers) {
      _wallet.servers = [conn.id];
    // if we don't already have a connection with this server
    } else if (_wallet.servers.indexOf(conn.id) == -1) {
      _wallet.servers.push(conn.id);
    }
    callback(null, _wallet);
  });
}
wallet.method('connect', connect, {
  description: 'connects the wallet',
  properties: {
    _wallet: {
      type: 'object'
    },
    server: {
      type: 'object'
    },
    callback: {
      type: 'function'
    }
  }
});

wallet.property('history', {
  description: 'list of all relevant wallet transaction ids',
  type: 'array',
  items: {
    type: 'string'
  },
  uniqueItems: true
});

function newAddress(callback) {

}
wallet.method('newAddress', newAddress, {
  description: 'generates a new empty address',
  properties: {
    callback: {
      type: 'function'
    }
  }
});

function unspent(account, callback) {
  // returns list of unspent inventory
}
wallet.method('unspent', unspent, {
  description: 'finds unspent inventory',
  properties: {
    account: {
      type: 'string'
    },
    callback: {
      type: 'function'
    }
  }
});

function receive(transaction, callback) {
  // returns receipt
}
wallet.method('receive', receive, {
  description: 'processes incoming transaction',
  properties: {
    transaction: {
      type: 'object'
    },
    callback: {
      type: 'function'
    }
  }
});

function request(transaction, callback) {
  // returns receipt
}
wallet.method('request', request, {
  description: 'processes outgoing transaction',
  properties: {
    transaction: {
      type: 'object'
    },
    callback: {
      type: 'function'
    }
  }
});

//
// implement queue to repeatedly poll the blockchain 
// for new transactions and call .receive on them
//

exports.wallet = wallet;
exports.dependencies = {
  'decimal': '*'
};