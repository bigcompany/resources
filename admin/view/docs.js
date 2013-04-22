module['exports'] = function (options, callback) {

  var resources = options.resources,
      $ = this.$;
  return callback(null, $.html());

}