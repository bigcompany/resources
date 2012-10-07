var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;
  resource.replicator.log(function(err, results){
    console.log(err, results);
    results.forEach(function(result){
      $('table').append('<tr><td>'+result.author+'</td><td>'+result.date+'</td><td>'+result.msg+'</td></tr>');
    });
    callback(null,  $.html());
  });

}