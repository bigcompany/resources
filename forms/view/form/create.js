var resource = require('resource');

module['exports'] = function (options, callback) {

 options = options || {};
 var r = resource.resources[options.resource];

 // convert form posted string values into their proper schema types
 Object.keys(r.schema.properties).forEach(function (prop, i) {
   if(options.data.hasOwnProperty(prop)) {
     switch(r.schema.properties[prop].type) {
       case "boolean":
         options.data[prop] = options.data[prop] === 'true' ? true : false;
         break;
       case "array":
         // TODO: account for the non-string array (items) types
         options.data[prop] = options.data[prop].replace(', ', '').split(',');
         break;
     }
   }
 });

 var $ = this.$,
     self = this,
     output = '',
     entity = options.resource || 'unknown';

  if (options.data) {
    r.create(options.data, function(err, result){
      if (err) {
        showForm(options.data, err.errors);
      } else {
        $('.message').html('Created!');
        $('form').remove();
        self.parent.get.present({ unscoped: true, resource: options.resource, id: result.id }, function(err, re){
          return callback(null, re);
        });
      }
    });
  } else {
    showForm();
  }

  function showForm (data, errors) {

    $('h1').html(entity + ' - create');
    $('.back').html('back to ' + entity);
    $('.back').attr('href', '/' + entity);
    $('legend').html(r.methods.create.schema.description);
    $('input[type="submit"]').attr('value', 'Create');

    cont = function(err, result) {
      if (result) {
        output += result;
      }
      if(arr.length === 0) {
        $('.inputs').html(output);
        return callback(null, $.html())
      }
      var property = arr.pop();
      var input = {};
      for(var p in r.schema.properties[property]) {
        input[p] = r.schema.properties[property][p];
      }
      input.name = property;
      for(var e in errors) {
        if (errors[e].property === input.name) {
          input.error = errors[e];
        }
      }
      input.value = input.default || '';
      if(data && typeof data[property] !== "undefined") {
        input.value = data[property];
      }

      options.control = input;
      self.parent.inputs.index.present(options, cont);
    };

    var arr = Object.keys(r.schema.properties);
    arr.reverse();
    cont();
  }

}
