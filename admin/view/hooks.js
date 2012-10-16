var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  var methods = {};

  for (var r in resource.resources) {
    for (var m in resource.resources[r].methods) {
      $('#if').append('<option>' + r + '::' + m + '</option>');
      $('#then').append('<option>' + r + '::' + m + '</option>');
      $('#before').append('<option>' + r + '::' + m + '</option>');
      $('#run').append('<option>' + r + '::' + m + '</option>');
    }
  }

  resource.resources.hook.all(function(err, results){
    results.sort(function(a,b){
      return a.if > b.if;
    });
    results.forEach(function(item){
      $('.table').append('<tr><td>' + eventLink(item.if) + '</td><td>' + eventLink(item.then) + '</td></tr>')
    });
    callback(null,  $.html());
  });

}

function eventLink (event) {
  var arr = event.split('::'),
      _resource = arr[0],
      _method   = arr[1];
  return '<a href ="/admin/resources/' + _resource + '/' + _method + '">' + event + '</a>'
}