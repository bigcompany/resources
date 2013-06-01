var query = require('./query');

module['exports'] = function (view, data, cb) {
  var $;

  if(typeof view.parent !== "undefined" && typeof view.parent.layout !== "undefined" && typeof view.parent.layout.present === 'function') {
    if (cb) {
      return view.parent.layout.present(data, function(err, content) {
        $ = query(content);
        $('#main').html(view.template);
        return cb(null, $.html());
      });
    } else {
      $ = query(view.parent.layout.present(data));
      $('#main').html(view.template);
    }
  } else {
    $ = query(view.template);
  }

  if (cb) {
    return cb(null, $.html());
  } else {
    return $.html();
  }
};