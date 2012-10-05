/**
 * Handlebars Support
 */

var handlebars;

exports.attach = function (options) {
  this.handlebars = {
    render: function (view, data, cb) {
      var html;
      try {
        html = handlebars.compile(view.template, options)(data);
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
    handlebars = require('handlebars');
    done();
  } catch (err) {
    done(err);
  }
};
