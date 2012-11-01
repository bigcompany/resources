var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {
  var $ = this.$;
  resource.replication.all(function(err, results){
    if(results.length === 0) {
      $('.history').remove();
    }
    results.forEach(function(result){
      var str = '<table class="table table-bordered">';
      str +='<tr><th colspan="2">'+result.time+'</th></tr>';
      str +='<tr><td>http://'+result.source+'/'+result.repo+'</td><td>http://'+result.target+'/'+result.repo+'</td></tr>';
      str += '</table>';
      $('.replications').append(str);
    });
    callback(null,  $.html());
  });
}