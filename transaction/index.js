var resource = require('resource'),
    logger = resource.logger,
    transfer = resource.use('transfer'),
    transaction = resource.define('transaction');

transaction.schema.description = 'for defining inventory transactions';

transaction.property('type', {
  description: 'type of transaction, ie. coin name',
  type: 'string'
});

transaction.property('source', {
  description: 'source of transaction, ie. block hash',
  type: 'string'
});

transaction.property('index', {
  description: 'index of source of transaction, ie. block index',
  type: 'number'
});

transaction.property('transfers', {
  description: 'list of transfers in transaction',
  type: 'array',
  items: {
    type: 'string'
  }
});

transaction.property('time', {
  description: 'time of transaction',
  type: 'number'
});

transaction.property('comment', {
  description: 'comment on transaction',
  type: 'string'
});

function init(options, callback) {
  transaction.get(options.id, function(err, tx) {
    if (err) {
      if (err.message === (options.id + " not found")) {
        // transaction does not yet exist, create it
        return transaction.create(options, function(err, result) {
          if (err) {
            throw err;
          }
          logger.info("created transaction", JSON.stringify(result));
          return callback(null, result);
        });
      }
      else {
        throw err;
      }
    } else if ((tx.type !== options.type) ||
        (tx.source !== options.source)) {
      // a different transaction with same id already exists
      throw "different transaction with same id " + options.id + "already exists!";
    }
    logger.info("transaction", options.id, "already initialized");
    return callback(null, tx);
  });
}
transaction.method('init', init, {
  description: 'initializes a transaction',
  properties: {
    options: transaction.schema,
    callback: {
      type: 'function'
    }
  }
});

transaction.dependencies = {
  'decimal': '*'
};
transaction.license = "AGPLv3";
exports.transaction = transaction;
