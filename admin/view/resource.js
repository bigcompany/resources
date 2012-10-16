var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  var _resource = resource.resources[options.resource],
      methods = resource.resources[options.resource].methods;

  $('.name').html(_resource.name);
  $('.description').html(_resource.schema.description);

  if (methods) {
    var _methods = Object.keys(methods).sort();
    _methods.forEach(function(method){
      $('.methods').append('<tr><td><a href="/admin/resources/' + _resource.name + '/' + method + '">' + _resource.name + '.' + method + '</a></td><td>' + (methods[method].schema.description || "&nbsp;") + '</td></tr>')
    });
  }

  if(Object.keys(_resource.dependencies).length > 0) {
    $('.dependencies').html(layout.controls.list.present({ items: _resource.dependencies, root: 'http://npmjs.org/package/' }));
  } else {
    $('.deps').remove();
  }

  $('.schema').html(JSON.stringify(_resource.schema, true, 2));

  var ds = _resource.config.datasource || 'none';
  if(ds !== 'none') {
    ds = '<a href="/admin/datasources/' +  ds + '">' + ds +'</a>';
    $('.datasource').html(ds);
  } else {
    $('.datasources').remove();
  }

  //$('.schema').html(resource.docs.schemaToHTML(options.resource.schema));
  callback(null, $.html());

}