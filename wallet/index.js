var resource = require('resource'),
    wallet = resource.define('wallet'),
    queue = resource.use('queue'),
    transfer = resource.use('transfer'),
    transaction = resource.use('transaction');

wallet.schema.description = 'for managing inventory';

wallet.connections = {};
queue.create({repeat: true, elements: []},
  function(err, _queue) {
    if (err) {
      throw err;
    }
    wallet.queue = _queue;
});

wallet.property('fee', {
  description: 'function that applies fee to outgoing transactions',
  type: 'function'
});

wallet.property('account', {
  description: 'token of account in wallet',
  type: 'string'
});

wallet.property('address', {
  description: 'address of wallet'
});

wallet.property('servers', {
  description: 'list of active coin servers',
  type: 'array',
  items: {
    type: 'string'
  },
  uniqueItems: true
});

function connect(_wallet, coin_name, options, callback) {
  // use coin resource
  var coin = resource.use(coin_name);
  coin.start();
  // connect to coin server
  coin.connect(options, function(err, conn) {
    if (err) {
      throw err;
    }
    // generate wallet connectId
    var connectId = coin_name + ":" + conn.id;
    var postQueue = function(err, _queue) {
      if (err) {
        throw err;
      }
      if ((!!_queue) && !_queue.started) {
        queue.start(_queue.id, postQueue);
      }
      //
      // add to servers of wallet instance
      //
      if (!_wallet.servers) {
      // if no servers already
        _wallet.servers = [connectId];
        wallet.update({
          id: _wallet.id,
          account: _wallet.account,
          servers: [connectId]
        }, callback);
      } else if (_wallet.servers.indexOf(connectId) == -1) {
      // if we don't already have a connection with this server
        wallet.update({
          id: _wallet.id,
          account: _wallet.account,
          servers: _wallet.servers.concat([connectId])
        }, callback);
      }
      wallet.repeatedlyPoll(connectId);
      callback(null, _wallet);
    };
    //
    // add to connections of wallet resource
    //
    var job = {
      method: "wallet::poll",
      with: connectId
    };
    if (!wallet.connections[connectId]) {
    // if no connections yet on this server
      wallet.connections[connectId] = [_wallet.id];
      return queue.push(wallet.queue.id, job, postQueue);
    } else if (wallet.connections[connectId].indexOf(_wallet.id) == -1) {
    // if we don't already have a connection with this server
      wallet.connections[connectId].push(_wallet.id);
      return queue.push(wallet.queue.id, job, postQueue);
    }
    return postQueue(null, null);
  });
}
wallet.method('connect', connect, {
  description: 'connects the wallet',
  properties: {
    _wallet: {
      type: 'object'
    },
    coin_name: {
      type: 'string'
    },
    server: {
      type: 'object'
    },
    callback: {
      type: 'function'
    }
  }
});

wallet.property('journal', {
  description: 'list of all transactions of this wallet',
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

function poll(connectId, callback) {
  var async = require('async');
  var strsplit = require('strsplit');
  var coin_server = strsplit(connectId, ':', 2);
  var coin_name = coin_server[0];
  var server = coin_server[1];

  var coin = resource.use(coin_name);

  coin.start();

  // TODO:
  // bitcoin.getTrasactions() -> filter -> generate transaction resources
  coin.listTransactions(server,
    ['*', 1000, 0],
    function(err, txs) {
    async.eachSeries(txs, function(tx, callback) {
      if (tx.account === null) {
      } else {
        wallet.find({account: tx.account}, function(err, result) {
          if (err) {
            throw err;
          }
          // for each wallet with that account name
          // should only be one
          if (result.length > 1) {
            throw "every wallet account should be unique!";
          }
          // prepare post-update callback
          var postUpdate = function(err, _wallet) {
            if (err) {
              throw err;
            }
            console.log(_wallet.account, 'has new transaction: ', tx.txid);
            callback(null);
          };
          //
          // add transaction to journal
          _wallet = result[0];
          //console.log(_wallet.account, _wallet.journal);
          // update journal appropriately
          if (!_wallet.journal) {
            // journal does not already exist
            wallet.update({
              id: _wallet.id,
              account: _wallet.account,
              servers: _wallet.servers,
              address: _wallet.address,
              journal: [tx.txid]
            }, postUpdate);
          } else if (_wallet.journal.indexOf(tx.txid) == -1) {
            // transaction is not in journal
            wallet.update({
              id: _wallet.id,
              account: _wallet.account,
              servers: _wallet.servers,
              address: _wallet.address,
              journal: _wallet.journal.concat([tx.txid])
            }, postUpdate);
          } else {
            return callback(null);
          }
        });
      }
    },
    function(err) {
      if (err) {
        throw err;
      }
      callback(null);
    });
  });
}
wallet.method('poll', poll, {
  description: 'poll for incoming transactions',
  properties: {
    connectId: {
      type: 'string'
    },
    callback: {
      type: 'function'
    }
  }
});

function repeatedlyPoll(connectId, callback) {

  // TODO:
  // implement queue to repeatedly poll the servers
  // for new confirmed transactions and call .receive on the
  // receipient wallets with wallet.receive(transaction)
  //
}
wallet.method('repeatedlyPoll', repeatedlyPoll, {
  description: 'repeatedly poll for incoming transactions'
});

wallet.dependencies = {
  'decimal': '*',
  'strsplit': '*',
  'async': '*'
};
wallet.license = "AGPLv3";
exports.wallet = wallet;
