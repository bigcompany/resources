var layout = require('./layout'),
resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;
  var output = '';
  resource.node.find({ role: 'server' }, function(err, results){
    results.forEach(function(record){
      output += ('<tr>'
             +     '<td><a href="http://' + record.id +'">' + record.id + '</a></td>'
             +     '<td>' + record.status + '</td>'
             +     '<td>' + record.lastSeen + '</td>'
             +   '</tr>');
    });
    $('.records').html(output);
    callback(null, $.html())
  });

}