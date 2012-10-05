/**
 * Underscore Support
 */

var underscore;

exports.attach = function (options) {
  this.underscore = {
    render: function (view, data, cb) {
      var html, tmpl;
      try {
        tmpl = underscore.template(view.template, null, options);
        html = tmpl(data).replace(/\n$/, '');
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
    underscore = require('underscore');
    done();
  } catch (err) {
    done(err);
  }
};
