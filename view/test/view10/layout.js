var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  callback(null, $.html());
};
