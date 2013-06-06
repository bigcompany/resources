var resource = require('resource'),
    blockchain = resource.define('blockchain'),
    block = resource.use('block'),
    transaction = resource.use('transaction'),
    transfer = resource.use('transfer'),
    put = resource.use('put'),
    logger = resource.logger;

blockchain.schema.description = 'for monitoring blockchain transactions';

blockchain.property('type', {
  description: 'type of blockchain',
  type: 'string'
});

blockchain.property('servers', {
  description: 'list of active servers',
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
    var coin = resource.use(_blockchain.type);
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
          type: _blockchain.type,
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
  var coin = resource.use(options.type),
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
      type: options.type,
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
        type: options.type
      }, function(err, _blockchains) {
        return async.each(_blockchains, function(_blockchain, callback) {
          if (_blockchain.servers.indexOf(options.connectId) == -1) {
            // blockchain instance is not connected to server
            logger.info('blockchain', _blockchain.id, 'not connected to server', connectId);
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
        type: {
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

function walletverify(options, callback) {
  // if verified, promote transaction to
  // a full transaction
  transaction.get(options.txid, function(err, tx) {
    if (err) {
      throw err;
    }
    // initialize libraries
    var coin = resource.use(options.type),
        async = require('async');
        _ = require('underscore');
    coin.start();
    coin.getRawTransaction(options.connectId, [options.txid], function(err, coinRawTx) {
      if (err) {
        throw err;
      }
      coin.decodeRawTransaction(options.connectId, [coinRawTx], function(err, coinFullTx) {
        if (err) {
          throw err;
        }
        logger.info('walletverify coinFullTx is', JSON.stringify(coinFullTx));
        // transaction is verified, create transfer
        var transferObj = {
          tx: options.txid
        };
        transfer.create(transferObj, function(err, _transfer) {
          // populate transfer with inputs from vin
          async.map(coinFullTx.vin, function(coinInput, callback) {
            // for each vin
            coin.getRawTransaction(options.connectId, [coinInput.txid], function(err, prevVinRawTx) {
              if (err) { throw err; }
              coin.decodeRawTransaction(options.connectId, [prevVinRawTx], function(err, prevVinFullTx) {
                if (err) { throw err; }
                // decode previous transaction of vin
                async.filter(prevVinFullTx.vout, function(item, callback) {
                  return callback(item.n === coinInput.vout);
                }, function(results) {
                  if (results.length !== 1) {
                    throw "multiple coin outputs with same number";
                  }
                  var vout = results[0];
                  // TODO: multiaddress if multiple addresses
                  var inObj = {
                    address: vout.scriptPubKey.addresses[0],
                    unit: options.type,
                    scale: vout.value,
                    inTransfer: _transfer.id
                  };
                  return put.create(inObj, function(err, input) {
                    if (err) { throw err; }
                    return callback(null, input.id);
                  });
                });
              });
            });
          }, function(err, inputs) {
            logger.info("inputs", inputs);
            if (err) { throw err; }
            // populate transfer with outs from vout
            async.map(coinFullTx.vout, function(vout, callback) {
              // for each vout
              // TODO: multiaddress if multiple addresses
              var outObj = {
                address: vout.scriptPubKey.addresses[0],
                unit: options.type,
                scale: vout.value,
                outTransfer: _transfer.id
              };
              return put.create(outObj, function(err, output) {
                if (err) { throw err; }
                return callback(null, output.id);
              });
            }, function(err, outputs) {
              if (err) { throw err; }
              logger.info("outputs", outputs);
              // update transfer with inputs and outputs
              _transfer.inputs = inputs;
              _transfer.outputs = outputs;
              _transfer.save(function(err, _transfer) {
                // update transaction with transfer
                if (err) { throw err; }
                tx.transfers = [_transfer.id];
                tx.save(callback);
              });
            });
          });
        });
      });
    });
  });
}
blockchain.method('walletverify', walletverify, {
  description: "call to verify a wallet transaction",
  properties: {
    options: blockchain.walletnotify.schema.properties.options,
    callback :{
      type: 'function'
    }
  }
});

function blocknotify(options, callback) {
  // set defaults
  if (typeof options.confirmations === 'undefined') {
    options.confirmations = 6;
  }
  // initialize libraries
  var coin = resource.use(options.type),
      async = require('async'),
      _ = require('underscore');
  coin.start();
  coin.getBlock(options.connectId, [options.blockhash], function(err, coinBlock) {
    if (err) {
      throw err;
    }
    logger.info('blocknotify block is', JSON.stringify(coinBlock));
    // initialize block
    var blockObj = {
      id: coinBlock.hash,
      type: options.type,
      index: coinBlock.height,
      txs: coinBlock.tx,
      time: coinBlock.time,
      prevBlock: coinBlock.previousblockhash,
      nextBlock: coinBlock.nextblockhash
    };
    logger.info("about to init block", JSON.stringify(blockObj));
    return block.init(blockObj, function(err, _block) {
      if (err) {
        throw err;
      }
      blockchain.find({
        type: options.type
      }, function(err, _blockchains) {
        return async.each(_blockchains, function(_blockchain, callback) {
          if (_blockchain.servers.indexOf(options.connectId) == -1) {
            // blockchain instance is not connected to server
            // ignore blocknotify tx
            logger.info('blockchain', _blockchain.id, 'not connected to server', connectId);
            return callback(null, null);
          } else {
            logger.info('confirmations', options.confirmations);
            // blockchain instance is connected to server
            if (options.confirmations < 1) {
              return blockchain.blockverify(_.clone(options), callback);
            } else {
              var _options = _.clone(options);
              _options.blockhash = _block.prevBlock;
              _options.confirmations -= 1;
              return blockchain.blocknotify(_options, callback);
            }
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
  description: 'notification of new block',
  properties: {
    options: {
      type: 'object',
      properties: {
        type: {
          type: 'string'
        },
        connectId: {
          type: 'string'
        },
        blockhash: {
          type: 'string'
        },
        confirmations: {
          type: 'number',
          required: false
        }
      }
    },
    callback: {
      type: 'function'
    }
  }
});
function blockverify(options, callback) {
  // if verified, promote transactions on 
  // this block to a full transaction
  transaction.find({source: options.blockhash}, function(err, txs) {
    if (err) {
      throw err;
    }
    // initialize libraries
    var coin = resource.use(options.type),
        async = require('async'),
        _ = require('underscore');
    coin.start();
    async.each(txs, function(tx, callback) {
      _options = _.clone(options);
      _options['txid'] = tx.id;
      return blockchain.walletverify(_options, callback);
    }, function(err) {
      if (err) {
        throw err;
      }
      callback(null, null);
    });
  });
}
blockchain.method('blockverify', blockverify, {
  description: "call to verify a block",
  properties: {
    options: blockchain.blocknotify.schema.properties.options,
    callback :{
      type: 'function'
    }
  }
});

blockchain.dependencies = {
  'decimal': '*',
  'socket.io': '*',
  'async': '*',
  'underscore': '*'
};
blockchain.license = "AGPLv3";
exports.blockchain = blockchain;
