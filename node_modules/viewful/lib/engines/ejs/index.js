/**
 * Ejs Support
 */

var ejs;

exports.attach = function (options) {
  this.ejs = {
    render: function (view, data, cb) {
      var html;
      try {
        html = ejs.compile(view.template, options)(data);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
  try {
    ejs = require('ejs');
    done();
  } catch (err) {
    done(err);
  }
};
