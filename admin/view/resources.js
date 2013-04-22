var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var resources = resource.resources,
      $ = this.$;

  var keys = Object.keys(resource.resources).sort();

  keys.forEach(function(r){
    var _resource = resource.resources[r];
    $('.resources').append('<tr><td><a href="/admin/resources/' + _resource.name + '">' + _resource.name + '</a></td><td>' + _resource.schema.description + '</td></tr>')
  });

  return callback(null, $.html());

}