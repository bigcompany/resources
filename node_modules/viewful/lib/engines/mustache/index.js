/**
 * Mustache Support
 */

var mustache;

exports.attach = function (options) {
  this.mustache = {
    render: function (view, data, cb) {
      var html;
      try {
        html = mustache.to_html(view.template, data);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
  try {
    mustache = require('mustache');
    done();
  } catch (err) {
    done(err);
  }
};
