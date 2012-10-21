var resource = require('resource');

//
// key.js - input fields key lookups
//
module['exports'] = function (input, options, callback) {

  var $ = this.$.load(this.template);

  $('.control-label').attr('for', input.name);
  $('.control-label').html(input.name);
  $('select').attr('id',  input.name);
  $('select').attr('name', input.name);
  $('select').attr('placeholder', input.description || '');

  resource[input.key].all(function(err, results){
    results.forEach(function(option){
      var selected = "";
      if(option.id === input.value) {
        selected = ' SELECTED ';
      }
      $('select').append('<option value="' + option.id + '" ' + selected + '>' + ( option.name || option.id ) + '</option>'); // Bad string concat!
    });
    callback(null, $.html());
  });

};
