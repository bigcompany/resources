var resource = require('resource'),
    hl = require("highlight").Highlight;

module['exports'] = function (options, callback) {

  var r = resource.resources[options.resource],
      method = r.methods[options.method],
      $ = this.$,
      view = this;

  if (typeof method === "undefined") {
    $('.codeHolder').remove();
    $('.schemaHolder').remove();
    $('h1').html('invalid method: ' + options.method);
    return callback(null, $.html());
  }

  $('.back').attr('href', '/admin/resources/' + options.resource);
  $('.schema').html(view.parent.schema.present({ schema: method.schema }));

  $('h1').html(options.resource + ' ' + method.name);
  $('.description').html(method.schema.description);
  // $('.methods').html(view.parent.layout.controls.list.present({ items: r.methods, root: '/admin/resources/foo/' }));
  $('.method').html(hl(method.unwrapped.toString()));

  var form = resource.forms.generate(options, function(err, str) {
    if(options.data) {
     $('.schemaHolder').remove();
     $('.codeHolder').remove();
    }
    $('.form').html(str);
    callback(null, $.html())
  });


}