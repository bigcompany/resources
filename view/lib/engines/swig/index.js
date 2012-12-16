/**
 * Swig Support
 */

exports.render = function (view, data) {
  var swig = require('swig'),
      html = swig.compile(view.template)(data);
  return html;
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (options) {
  var swig = require('swig');
  swig.init(options);
};
