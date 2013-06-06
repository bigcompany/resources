var resource = require('resource'),
    transfer = resource.define('transfer');

transfer.schema.description = 'for defining inventory transfers';

transfer.property('tx', {
  description: 'transaction that contains transfer',
  type: 'string'
});

transfer.property('inputs', {
  description: 'inputs to transfer',
  type: 'array',
  items: {
    type: 'string'
  }
});

transfer.property('outputs', {
  description: 'outputs to transfer',
  type: 'array',
  items: {
    type: 'string'
  }
});

transfer.property('comment', {
  description: 'comment on transfer',
  type: 'string'
});

transfer.dependencies = {
  'decimal': '*'
};
transfer.license = "AGPLv3";
exports.transfer = transfer;
