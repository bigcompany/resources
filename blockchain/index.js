var resource = require('resource'),
    blockchain = resource.define('blockchain'),
    block = resource.use('block'),
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

function walletnotify(options, callback) {
  logger.info('.walletnotify(', options.coinName, options.connectId, options.txid, callback, ')');
  var coin = resource.use(options.coinName),
      async = require('async');
  coin.start();
  coin.getTransaction(options.connectId, [options.txid], function(err, coinTx) {
    if (err) {
      throw err;
    }
    logger.info('walletnotify coinTx is', JSON.stringify(coinTx));
    // initialize coinTx
    var txObj = {
      id: coinTx.txid,
      type: options.coinName,
      source: coinTx.blockhash,
      index: coinTx.blockindex,
      time: coinTx.time
    };
    logger.info("about to init coinTx", JSON.stringify(txObj));
    transaction.init(txObj, function(err, _transaction) {
      if (err) {
        throw err;
      }
      blockchain.find({
        coin: options.coinName
      }, function(err, _blockchains) {
        return async.each(_blockchains, function(_blockchain, callback) {
          if (_blockchain.servers.indexOf(options.connectId) == -1) {
            // blockchain instance is not connected to server
            log.info('blockchain', _blockchain.id, 'not connected to server', connectId);
            // ignore walletnotify tx
            return callback(null, null);
          } else {
            // blockchain instance is connected to server
            return callback(null, null);
          }
        }, function(err) {
          if (err) {
            throw err;
          }
          return callback(null, _transaction);
        });
      });
    });
  });
}
blockchain.method('walletnotify', walletnotify, {
  description: 'notification of new wallet transaction',
  properties: {
    options: {
      type: 'object',
      properties: {
        coinName: {
          type: 'string'
        },
        connectId: {
          type: 'string'
        },
        txid: {
          type: 'string'
        }
      }
    },
    callback: {
      type: 'function'
    }
  }
});
function blocknotify(options, callback) {
  logger.info('.blocknotify(', options.coinName, options.connectId, options.blockhash, callback,')');
  var coin = resource.use(options.coinName),
      async = require('async');
  coin.start();
  coin.getBlock(options.connectId, [options.blockhash], function(err, coinBlock) {
    if (err) {
      throw err;
    }
    logger.info('blocknotify block is', JSON.stringify(coinBlock));
    // initialize block
    var blockObj = {
      id: coinBlock.hash,
      type: options.coinName,
      index: coinBlock.height,
      txs: coinBlock.tx,
      time: coinBlock.time
    };
    logger.info("about to init block", JSON.stringify(blockObj));
    return block.init(blockObj, function(err, _block) {
      if (err) {
        throw err;
      }
      blockchain.find({
        coin: options.coinName
      }, function(err, _blockchains) {
        return async.each(_blockchains, function(_blockchain, callback) {
          if (_blockchain.servers.indexOf(options.connectId) == -1) {
            // blockchain instance is not connected to server
            // ignore blocknotify tx
            log.info('blockchain', _blockchain.id, 'not connected to server', connectId);
            return callback(null, null);
          } else {
            // blockchain instance is connected to server
            return callback(null, null);
          }
        }, function(err) {
          if (err) {
            throw err;
          }
          return callback(null, _block);
        });
      });
    });
  });
}
blockchain.method('blocknotify', blocknotify, {
  description: 'notification of new wallet transaction',
  properties: {
    options: {
      type: 'object',
      properties: {
        coinName: {
          type: 'string'
        },
        connectId: {
          type: 'string'
        },
        blockhash: {
          type: 'string'
        }
      }
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