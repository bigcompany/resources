/**
 * Dust Support
 */

var dust;

exports.attach = function (options) {
  this.dust = {
    render: function (view, data, cb) {
      // Remark: Dust cannot render synchonously, it can however return a
      // stream object if dust.renderSource(source, context, [cb]) is called
      // with no callback, that is currently not implemented in this plugin.
      if (typeof cb === 'undefined') { 
        throw new Error('dust template engine cannot render synchronously');
      }
      try {
        dust.compileFn(view.template)(data, cb);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
  try {
    dust = require('dust');
    done();
  } catch (err) {
    try {
      dust = require('dustjs-linkedin');
      done();
    } catch (err) {
      done(err);
    }
  }
};
