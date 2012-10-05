/**
 * Jazz Support
 */

var jazz;

exports.attach = function (options) {
  this.jazz = {
    render: function (view, data, cb) {
      var tmpl;
      if (typeof cb === 'undefined') {
        throw new Error('jazz template engine cannot render synchronously');
      }
      try {
        tmpl = jazz.compile(view.template, options);
        tmpl.eval(data, function (str) { cb(null, str); });
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
    }
  };
};

// 'exports.init' gets called by broadway on app.init()'
exports.init = function (done) {
  try {
    jazz = require('jazz');
    done();
  } catch (err) {
    done(err);
  }
};
