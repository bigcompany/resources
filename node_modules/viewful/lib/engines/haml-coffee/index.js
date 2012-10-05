/**
 * Haml-Coffee Support
 */

var hamlCoffee;

exports.attach = function (options) {
  this['haml-coffee'] = {
    render: function (view, data, cb) {
      var html;
      try {
        html = hamlCoffee.compile(view.template, options)(data);
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
    hamlCoffee = require('haml-coffee');
    done();
  } catch (err) {
    done(err);
  }
};
