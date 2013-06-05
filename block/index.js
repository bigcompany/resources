var resource = require('resource'),
    block = resource.define('block'),
    logger = resource.logger;

block.schema.description = 'for monitoring blocks';

block.property('type', {
  description: 'type of block, ie. coin name',
  type: 'string'
});

block.property('index', {
  description: 'index of block, ie. block height',
  type: 'number'
});

block.property('prevBlock', {
  description: 'id of previous block',
  type: 'string'
});

block.property('nextBlock', {
  description: 'id of next block',
  type: 'string'
});

block.property('time', {
  description: 'time of block',
  type: 'number'
});

function init(options, callback) {
  block.get(options.id, function(err, _block) {
    if (err) {
      if (err.message === (options.id + " not found")) {
        // block does not yet exist, create it
        return block.create(options, function(err, result) {
          if (err) {
            throw err;
          }
          logger.info("created block", JSON.stringify(result));
          return callback(null, result);
        });
      }
      else {
        throw err;
      }
    } else if ((_block.type != options.type) ||
        (_block.index != options.index)) {
      logger.info(JSON.stringify(_block), JSON.stringify(options));
      // a different block with same id already exists
      throw "different block with same id " + options.id + "already exists!";
    }
    logger.info("block", options.id, "already initialized");
    return callback(null, _block);
  });
}
block.method('init', init, {
  description: 'initializes a block',
  properties: {
    options: block.schema,
    callback: {
      type: 'function'
    }
  }
});

block.dependencies = {
  'decimal': '*',
  'async': '*'
};
block.license = "AGPLv3";
exports.block = block;
