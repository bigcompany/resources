/**
 * Whiskers Support
 */

var whiskers;

exports.attach = function (options) {
  this.whiskers = {
    render: function (view, data, cb) {
      var html;
      try {
        html = whiskers.render(view.template, data);
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
    whiskers = require('whiskers');
    done();
  } catch (err) {
    done(err);
  }
};
