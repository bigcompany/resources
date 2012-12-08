/**
 * Swig Support
 */
var swig = require('swig');

exports.render = function (view, data) {
  var html = swig.compile(view.template)(data);
  return html;
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (options) {
  swig.init(options);
};
