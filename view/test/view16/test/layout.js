var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  $('h2').html('big');

  callback(null, $.html());
};
