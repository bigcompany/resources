/**
 * Markdown support.
 */

var markdown;

exports.attach = function (options) {
  this.markdown = {
    render: function (view, data, cb) {
      var html;
      try {
        html = require('marked')(view.template);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  }
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
  try {
    markdown = require('marked');
    done();
  } catch (err) {
    done(err);
  }
};
