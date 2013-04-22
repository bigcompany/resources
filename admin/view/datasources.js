var resource = require('resource');

module['exports'] = function (options, callback) {

  var datasources = options.datasources,
      $ = this.$;

  resource.datasource.all(function(err, datasources){
    datasources.forEach(function(datasource){
      $('table').append('<tr><td><a href="/admin/resources/datasource/get/' + datasource.id + '">' + datasource.id + '</a></td><td>' + datasource.status + '</td><td><a href="/admin/resources/datasource/test/' + datasource.id + '">test connection</a></td></tr>');
    });
    return callback(null, $.html());
  });

}