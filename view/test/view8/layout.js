var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  this.parent.index.template = '<div class="user">\n\t<div class="name">name</div>\n\t<div class="email">email</div>\n</div>';

  callback(null, $.html());
};
