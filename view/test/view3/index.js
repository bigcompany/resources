var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = options.$;

  $('.user > .name').html('Bob');
  $('.user > .email').html('bob@bob.com');

  callback(null, $.html());
};
