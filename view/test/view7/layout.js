var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  $('h1').html('big');
  $('.main').html('big');

  callback(null, $.html());
};
