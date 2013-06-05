var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  $('.user > .name').html(options.name);
  $('.user > .email').html(options.email);

  callback(null, $.html());
};
