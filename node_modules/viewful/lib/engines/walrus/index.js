/**
 * Walrus Support
 */

var walrus;

exports.attach = function (options) {
  this.walrus = {
    render: function (view, data, cb) {
      var html;
      try {
        html = walrus.parse(view.template).compile(data);
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
    walrus = require('walrus');
    done();
  } catch (err) {
    done(err);
  }
};
