var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  var methods = {},
  events = [];
  for (var r in resource.resources) {
    for (var m in resource.resources[r].methods) {
      events.push(r + '::' + m);
    }
  }

  events.sort();

  events.forEach(function(ev){
    var option = '<option value = "' + ev + '">' + ev + '</option>';
    $('#if').append(option);
    $('#then').append(option);
  });

  resource.resources.hook.all(function(err, results){
    results.sort(function(a,b){
      return a.if > b.if;
    });
    results.forEach(function(item){
      $('.hooks').append('<tr><td>' + eventLink(item.if) + '</td><td>' + eventLink(item.then) + '</td><td>' + '<a href="/admin/resources/hook/get/' + item.id +'"><i class="icon-edit"></i></a>' + '</td></tr>')
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
