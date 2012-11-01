var cheerio = require('cheerio');

exports.render = function (view, data, cb) {
  var str;
  if(typeof view.parent.layout.present === 'function') {
    var $ = cheerio.load(view.parent.layout.present());
    $('#main').html(view.template);
  } else {
    var $ = cheerio.load(view.template);
  }
  str = $.html();
  if (cb) {
    return cb(null, str);
  } else {
    return str;
  }
}