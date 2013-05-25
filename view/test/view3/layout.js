var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = options.$;

  $('h1').html('big');

  callback(null, $.html());
};
