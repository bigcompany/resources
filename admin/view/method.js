var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var r = resource.resources[options.resource],
      method = r.methods[options.method],
      $ = this.$;

  $('h1').html(options.resource + ' ' + method.name);
  $('.description').html(method.schema.description);
  $('.methods').html(layout.controls.list.present({ items: r.methods, root: '/admin/resources/foo/' }));
  $('.method').html(method.unwrapped.toString());
  var form = resource.forms.generate(options);
  form.render();
  $('.back').attr('href', '/admin/resources/' + options.resource);

  form.present(options, function(err, str){
    $('.form').html(str);
    callback(null, $.html())
  });

  //$('.schema').html(resource.docs.schemaToHTML(options.resource.schema));

}