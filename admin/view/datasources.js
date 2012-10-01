module['exports'] = function (options, callback) {

  var datasources = options.datasources,
      $ = this.$;

  datasources.forEach(function(datasource){
    $('table').append('<tr><td><a href="/admin/datasources/' + datasource.id + '">' + datasource.id + '</a></td><td>' + datasource.status + '</td><td><a href="">X</a></td></tr>');
  });

  return $.html();

}