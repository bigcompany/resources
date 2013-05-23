module['exports'] = function (options, callback) {
  var $ = this.$;
  //
  // Set active class on navbar button
  //
  //$('.navbar').remove();
  return callback(null, $.html());
}