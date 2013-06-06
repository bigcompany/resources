var resource = require('resource'),
    put = resource.define('put');

put.schema.description = 'for defining inventory {in,out}puts';

put.property('address', {
  description: 'where quantity is put at',
  type: 'any',
  required: true
});

put.property('unit', {
  description: 'unit associated with scale of put',
  type: 'any',
  required: true
});

put.property('scale', {
  description: 'scale associated with unit of put',
  type: 'any',
  required: true
});

put.property('inTransfer', {
  description: 'input transfer',
  type: 'string',
  required: false
});

put.property('outTransfer', {
  description: 'output transfer',
  type: 'string',
  required: false
});

put.property('comment', {
  description: 'comment on put',
  type: 'string',
  required: false
});

put.dependencies = {
  'decimal': '*'
};
put.license = "AGPLv3";
exports.put = put;
