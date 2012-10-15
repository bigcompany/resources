var layout = require('./layout'),
resource = require('resource');

module['exports'] = function (options, callback) {
  var $ = this.$;
  resource.node.all(function(err, results){
    $('.nodes').html('');
    results.forEach(function(record){
      var output;
      if(record.role === "server") {
        output = ('<tr>'
               +     '<td><a href="/admin/resources/node/get/' + record.id +'">' + record.id + '</a></td>'
               +     '<td>' + record.status + '</td>'
               +     '<td>' + record.lastSeen + '</td>'
               +   '</tr>');
        $('.servers .nodes').append(output);
      } else if(record.status === "connected") {
        output = ('<tr>'
               +     '<td><a href="/admin/resources/node/get/' + record.id +'">' + record.id + '</a></td>'
               +     '<td>' + record.status + '</td>'
               +     '<td>' + record.lastSeen + '</td>'
               +   '</tr>');

        $('.clients .nodes').append(output);
      }
    });
    if($('.clients .nodes').length === 1) {
      $('.clients').remove()
    }
    callback(null, $.html())
  });
}