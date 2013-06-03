var resource = require('resource'),
    blockchain = resource.define('blockchain'),
    logger = resource.logger;

blockchain.schema.description = 'for monitoring blockchain transactions';

blockchain.txs = {};

function walletnotify(txid, callback) {
  console.log('walletnotify', txid);
  var bitcoin = resource.use('bitcoin');
  bitcoin.start();
  bitcoin.connect({}, function(err, conn) {
    bitcoin.getTransaction(conn.id, [txid], function(err, tx) {
      if (err) {
        throw err;
      }
      logger.log(tx.toString());
      return callback(null, tx);
    });
  });
}
blockchain.method('walletnotify', walletnotify, {
  description: 'notification of new wallet transaction',
  properties: {
    txid: {
      type: 'string'
    },
    callback: {
      type: 'function'
    }
  }
});
function blocknotify(blockhash, callback) {
  logger.log('blocknotify', blockhash);
  var bitcoin = resource.use('bitcoin');
  bitcoin.start();
  bitcoin.connect({}, function(err, conn) {
    bitcoin.getBlock(conn.id, [blockhash], function(err, block) {
      if (err) {
        throw err;
      }
      logger.log(block.toString());
      return callback(null, block);
    });
  });
}
blockchain.method('blocknotify', blocknotify, {
  description: 'notification of new block',
  properties: {
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
  'socket.io': '*'
};
