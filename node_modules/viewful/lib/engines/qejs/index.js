/**
 * QEJS Support
 */

var qejs;

exports.attach = function (options) {
  this.qejs = {
    render: function (view, data, cb) {
      if (typeof cb === 'undefined') {
        throw new Error('qejs template engine cannot render synchronously');
      }
      qejs.render(view.template, data).then(function (str) {
        cb(null, str);
      }, function (err) {
        cb(err)
      }).end();
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
  try {
    qejs = require('qejs');
    done();
  } catch (err) {
    done(err);
  }
};
