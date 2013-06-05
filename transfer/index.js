var resource = require('resource'),
    transfer = resource.define('transfer');

transfer.schema.description = 'for defining inventory transfers';

transfer.property('unit', {
  description: 'unit associated with scale of transfer',
  type: 'string'
});

transfer.property('scale', {
  description: 'scale associated with unit of transfer',
  type: 'number'
});

transfer.property('source', {
  description: 'where quantity will be withdrawn',
  type: 'string'
});

transfer.property('destination', {
  description: 'where quantity will be deposited',
  type: 'string'
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
