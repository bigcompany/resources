var layout = require('./layout'),
    resource = require('resource');


module['exports'] = function (options, callback) {

  var $ = this.$;
  $('.description').html(options.resource.schema.description);
  $('.methods').html(layout.controls.list.present({ items: options.methods, root: '/admin/resources/' + options.resource.name + '/' }));

  if(Object.keys(options.resource.dependencies).length > 0) {
    $('.dependencies').html(layout.controls.list.present({ items: options.resource.dependencies, root: 'http://npmjs.org/package/' }));
  } else {
    $('.dependencies').html('none');
  }

  $('.datasource').html(options.resource.config.datasource || 'none');

  //$('.schema').html(resource.docs.schemaToHTML(options.resource.schema));

  return $.html();

}