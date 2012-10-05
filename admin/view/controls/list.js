module['exports'] = function (options, callback) {

  var items = options.items,
      $ = this.$,
      desc = '';

  $('.items').children().remove();
  Object.keys(items).sort().forEach(function(item){
    if(typeof items[item].schema !== 'undefined') {
      desc = items[item].schema.description;
    }
    $('.items').append('<li><a href="' + options.root + item +'">' + item + '</a> ' + desc  +'</li>');
  });

  return $.html();

}