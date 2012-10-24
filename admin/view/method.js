var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var r = resource.resources[options.resource],
      method = r.methods[options.method],
      $ = this.$,
      view = this;

  $('h1').html(options.resource + ' ' + method.name);
  $('.description').html(method.schema.description);
  $('.methods').html(layout.controls.list.present({ items: r.methods, root: '/admin/resources/foo/' }));
  $('.method').html(method.unwrapped.toString());
  var form = resource.forms.generate(options);
  form.render();
  $('.back').attr('href', '/admin/resources/' + options.resource);
  $('.schema').html(view.parent.schema.present({ schema: method.schema }));
  form.present(options, function(err, str){
    if(options.data) {
     $('.schemaHolder').remove();
     $('.codeHolder').remove();
    }
    $('.form').html(str);
    callback(null, $.html())
  });

}