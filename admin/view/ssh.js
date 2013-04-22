var layout = require('./layout');

module['exports'] = function (options, callback) {
  var $ = this.$;
  return callback(null, $.html())
}