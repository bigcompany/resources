var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;
  console.log(this);

  $('h1').html('big');

  callback(null, $.html());
};
