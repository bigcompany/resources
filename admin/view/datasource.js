module['exports'] = function (options, callback) {

  var datasource = options.datasource,
      $ = this.$;

  $('.datasource').html(JSON.stringify(datasource, true, 2));
  return $.html();

}