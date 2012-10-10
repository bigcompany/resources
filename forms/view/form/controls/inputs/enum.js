//
// enum.js - input fields for String types, bound by enum constraint
//

module['exports'] = function (input, options, callback) {

  var $ = this.$;

  if(options.error) {
    options.error.validate.errors.forEach(function(error){
      if(input.name === error.property){
        $('.control-group').addClass('error');
        $('.help-inline').html(error.message);
      }
    });
    for(var v in options.error.value) {
      if(input.name === v){
        input.value = options.error.value[v];
      }
    }
  }


  $('.control-label').attr('for', input.name);
  $('.control-label').html(input.name);
  $('select').attr('id',  input.name);
  $('select').attr('name', input.name);
  $('select').attr('placeholder', input.description || '');
  $('select option').html('Please select ' + input.name + '...');

  var _options = input.enum;
  _options.forEach(function(option){
    var selected = "";
    if(option === input.value) {
      selected = ' SELECTED ';
    }
    $('select').append('<option value=' + option + selected + '>' + option + '</option>'); // Bad string concat!
  });

  return callback(null, $.html());
};
