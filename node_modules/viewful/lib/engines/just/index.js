/**
 * Just Support
 */

var Just;

exports.attach = function (options) {
  options = options || {};
  this.just = {
    render: function (view, data, cb) {
      var engine;
      if (typeof cb === 'undefined') {
        throw new Error('just template engine cannot render synchronously');
      }
      options.root = {};
      options.root.page = view.template;
      engine = new Just(options);
      try {
        engine.render('page', data, cb);
      } catch (err) {
        cb(err);
      }        
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
  try {
    Just = require ('just'),
    done();
  } catch (err) {
    done(err);
  }
};
