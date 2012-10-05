/**
 * Jade support.
 */

var jade;

exports.attach = function (options) {
  this.jade = {
    render: function (view, data, cb) {
      var html;
      try {
        html = jade.compile(view.template, options)(data);
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
    jade = require('jade');
    done();
  } catch (err) {
    done(err);
  }
};
