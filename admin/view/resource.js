var layout = require('./layout');

module['exports'] = function (options, callback) {

  var $ = this.$;
  $('.description').html(options.resource.schema.description);
  $('.methods').html(layout.controls.list.present({ items: options.methods, root: '/admin/resources/' + options.resource.name + '/' }));

  if(Object.keys(options.resource.dependencies).length > 0) {
    $('.dependencies').html(layout.controls.list.present({ items: options.resource.dependencies, root: 'http://npmjs.org/package/' }));
  } else {
    $('.depsRow').remove();
  }

  return $.html();

}