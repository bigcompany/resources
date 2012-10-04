var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;
  $('.description').html(options.resource.schema.description);

  if (options.methods) {
    $('.methods').html(layout.controls.list.present({ items: options.methods, root: '/admin/resources/' + options.resource.name + '/' }));
  }

  if(Object.keys(options.resource.dependencies).length > 0) {
    $('.dependencies').html(layout.controls.list.present({ items: options.resource.dependencies, root: 'http://npmjs.org/package/' }));
  } else {
    $('.dependencies').html('none');
  }

  var ds = options.resource.config.datasource || 'none';
  if(ds !== 'none') {
    ds = '<a href="/admin/datasources/' +  ds + '">' + ds +'</a>';
  }

  $('.datasource').html(ds);

  //$('.schema').html(resource.docs.schemaToHTML(options.resource.schema));

  return $.html();

}