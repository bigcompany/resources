var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  this.parent.index.presenter = function (options, callback) {
    callback(null, "hi");
  };

  callback(null, $.html());
};
