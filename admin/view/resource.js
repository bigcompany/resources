var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$,
      view = this;

  var _resource = resource.resources[options.resource],
      methods;

  if(typeof _resource === 'undefined') {
    $('.name').html(options.resource + ' is not a valid resource!');
    $('.resource').remove();
    return callback(null, $.html());
  }

  methods = resource.resources[options.resource].methods;
  $('.name').html(_resource.name);
  $('.description').html(_resource.schema.description);

  if (methods) {
    var _methods = Object.keys(methods).sort();
    _methods.forEach(function(method){
      $('.methods').append('<tr><td><a href="/admin/resources/' + _resource.name + '/' + method + '">' + _resource.name + '.' + method + '</a></td><td>' + (methods[method].schema.description || "&nbsp;") + '</td></tr>')
    });
  }

  if(typeof _resource.dependencies !== "undefined" && Object.keys(_resource.dependencies).length > 0) {
    for(var dep in _resource.dependencies) {
      $('.dependencies').append('<tr><td><a href="http://npmjs.org/package/' + dep + '">' + dep + '</a></td><td>' + _resource.dependencies[dep] + '</td></tr>');
    }
  } else {
    $('.deps').remove();
  }

  if (Object.keys(_resource.schema.properties).length === 0) {
    $('.schema').remove();
  } else {
    $('.properties').html(view.parent.schema.present({ schema: _resource.schema }));
  }

  var ds = _resource.config.datasource || 'none';
  if(ds !== 'none') {
    ds = 'This resource is currently persisting it\'s data to the <a href="/admin/datasources/' +  ds + '">' + ds +'</a> datasource';
    $('.datasource').html(ds);
  } else {
    $('.datasources').remove();
  }

  //$('.schema').html(resource.docs.schemaToHTML(options.resource.schema));
  callback(null, $.html());

}