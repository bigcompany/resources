/**
 * Liquor Support
 */

var liquor;

exports.attach = function (options) {
  this.liquor = {
    render: function (view, data, cb) {
      var html;
      try {
        html = liquor.compile(view.template, options)(data);
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
    liquor = require('liquor');
    done();
  } catch (err) {
    done(err);
  }
};
