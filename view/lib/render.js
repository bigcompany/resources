var render = function (options, callback) {
  var $ = this.$;

  if (typeof callback === "function") {
    callback(null, $.html());
  } else {
    return $.html();
  }
};

module['exports'] = render;