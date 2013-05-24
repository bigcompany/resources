exports.render = function (view, data, cb) {
  var cheerio = require('cheerio'),
      str,
      $;

  if(typeof view.parent !== "undefined" && typeof view.parent.layout !== "undefined" && typeof view.parent.layout.present === 'function') {
    if (cb) {
      return view.parent.layout.present(data, function(err, content) {
        $ = cheerio.load(content);
        $('#main').html(view.template);
        return cb(null, $.html());
      });
    } else {
      $ = cheerio.load(view.parent.layout.present(data));
      $('#main').html(view.template);
    }
  } else {
    $ = cheerio.load(view.template);
  }
  str = $.html();
  if (cb) {
    return cb(null, str);
  } else {
    return str;
  }
}