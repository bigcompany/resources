var resource = require('resource'),
    blockchain = resource.define('blockchain'),
    transaction = resource.use('transaction'),
    logger = resource.logger;

blockchain.schema.description = 'for monitoring blockchain transactions';

blockchain.property('coin', {
  description: 'name of coin on blockchain',
  type: 'string'
});

blockchain.property('servers', {
  description: 'list of active coin servers',
  type: 'array',
  items: {
    type: 'string'
  },
  uniqueItems: true
});

function connect(id, server, callback) {
  // get blockchain instance
  blockchain.get(id, function(err, _blockchain) {
    if (err) {
      throw err;
    }
    // use coin resource
    var coin = resource.use(_blockchain.coin);
    coin.start();
    // connect to coin server
    coin.connect(server, function(err, conn) {
      if (err) {
        throw err;
      }
      //
      // add to blockchain servers
      //
      if ((!_blockchain.servers) ||
        // if no servers yet on this blockchain
        (_blockchain.servers.indexOf(conn.id) == -1))
        // OR if server not yet on this blockchain
      {
        logger.info('updating blockchain', id);
        return blockchain.update({
          id: _blockchain.id,
          coin: _blockchain.coin,
          servers: (_blockchain.servers || []).concat([conn.id]),
          transactions: _blockchain.transactions || [],
          unconfirmed: _blockchain.unconfirmed || {}
        }, callback);
      }
      return callback(null, _blockchain);
    });
  });
}
blockchain.method('connect', connect, {
  description: 'connects the wallet',
  properties: {
    id: {
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

blockchain.property('blockcount', {
  description: 'number of blocks in longest chain',
  type: 'number'
});

blockchain.property('unconfirmedblocks', {
  description: 'object of { block index : block hash }',
  type: 'object'
});

/*
blockchain.property('unconfirmedtx', {
  description: 'object of { block hash : [tx] }',
  type: 'object'
});

blockchain.property('transactions', {
  description: 'list of blockchain transactions',
  type: 'array',
  items: {
    type: 'string'
  }
});
*/

function updatetx(coinName, tx, callback) {
  logger.info('.updatetx(',coinName, tx, callback, ')');
  var txObj = {
    id: tx.txid,
    type: coinName,
    source: tx.blockhash
  };
  logger.info(txObj.id);
  transaction.get(txObj.id, function(err, transaction) {
    if (err) {
      throw err;
    }
    if (!transaction) {
      return transaction.create(
        {id: txid, type: coinName, source: tx.blockhash},
        function(err, result) {
          callback(null, result);
        });
    } else if ((transaction.type != txObj.type) ||
        (transaction.source != txObj.source)) {
      throw "transaction id " + txObj.id + "already existed!";
    }
    return callback(null, result);
  });
}
blockchain.method('updatetx', updatetx, {
  description: 'updates the transaction'
});

function walletnotify(coinName, connectId, txid, callback) {
  logger.info('.walletnotify(', coinName, connectId, txid, callback, ')');
  var coin = resource.use(coinName),
      async = require('async');
  coin.start();
  coin.getTransaction(connectId, [txid], function(err, tx) {
    if (err) {
      throw err;
    }
    logger.info('walletnotify tx is', JSON.stringify(tx));
    blockchain.find({
      coin: coinName
    }, function(err, _blockchains) {
      return async.each(_blockchains, function(_blockchain, callback) {
        if (_blockchain.servers.indexOf(connectId) == -1) {
          // blockchain instance is not connected to server
          log.debug('blockchain', _blockchain.id, 'not connected to server', connectId);
          // ignore walletnotify tx
          callback(null, tx);
        } else {
          // blockchain instance is connected to server
          blockchain.updatetx(coinName, tx, callback);
          logger.info('tx', JSON.stringify(tx));
        }
      }, function(err, txs) {
        if (err) {
          throw err;
        }
        return callback(null, txs);
      });
    });
  });
}
blockchain.method('walletnotify', walletnotify, {
  description: 'notification of new wallet transaction',
  properties: {
    coinName: {
      type: 'string'
    },
    connectId: {
      type: 'string'
    },
    txid: {
      type: 'string'
    },
    callback: {
      type: 'function'
    }
  }
});
function blocknotify(coinName, connectId, blockhash, callback) {
  logger.info('.blocknotify(', coinName, connectId, blockhash, callback,')');
  var coin = resource.use(coinName),
      async = require('async');
  coin.start();
  coin.getBlock(connectId, [blockhash], function(err, block) {
    if (err) {
      throw err;
    }
    logger.info('blocknotify block is', JSON.stringify(block));
    blockchain.find({
      coin: coinName
    }, function(err, _blockchains) {
      return async.each(_blockchains, function(_blockchain, callback) {
        if (_blockchain.servers.indexOf(connectId) == -1) {
          // blockchain instance is not connected to server
          // ignore blocknotify tx
        } else {
          // blockchain instance is connected to server
          //blockchain.updatetx(_blockchain.id, tx, callback);
        }
      }, function(err) {
        if (err) {
          throw err;
        }
        return callback(null, block);
      });
    });
  });
}
blockchain.method('blocknotify', blocknotify, {
  description: 'notification of new wallet transaction',
  properties: {
    coinName: {
      type: 'string'
    },
    connectId: {
      type: 'string'
    },
    blockhash: {
      type: 'string'
    },
    callback: {
      type: 'function'
    }
  }
});

exports.blockchain = blockchain;
exports.dependencies = {
  'decimal': '*',
  'socket.io': '*',
  'async': '*'
};
exports.license = "AGPLv3";