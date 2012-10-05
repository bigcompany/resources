var cheerio = require('cheerio');

exports.attach = function (options) {
  this.plates = {
    render : function (view, data, cb) {
      //
      // Remark: Layout code should probably be abstracted out to plates
      //
      var layout = cheerio.load(view['layout']);
      if (cb) {
        view.present(data, function (err, result) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          layout('body').html(result);
          return cb(null, layout.html())
        })
      } else {
        layout('body').html(view.present(data));
        return layout.html();
      }
    }
  }
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
};