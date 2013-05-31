var resource = require('resource'),
    transfer = resource.use('transfer'),
    transaction = resource.define('transaction');

transaction.schema.description = 'for defining inventory transactions';

transaction.property('transfer', {
  description: 'list of transfers in transaction',
  type: 'array',
  items: transfer.schema
});

transaction.property('timestamp', {
  description: 'timestamp of transaction',
  type: 'number'
});

transaction.property('source', {
  description: 'source of the transaction',
  properties: {
    name: {
      type: 'string'
    },
    id: {
      type: 'string'
    }
  }
});

transaction.property('comment', {
  description: 'comment on transaction',
  type: 'string'
});

exports.transaction = transaction;
exports.dependencies = {
  'decimal': '*'
};
