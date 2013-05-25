module['exports'] = function (options, callback) {

  var $ = this.$;

  $('.name').html(this.name);
  $('.presenter').html(this.presenter);
  $('.parent').html(this.parent.name);
  $(".template").html(this.template);

  callback(null, $.html());
};