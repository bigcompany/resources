module['exports'] = function (options, callback) {

  var $ = this.$;

  $('.name').html(this.name);
  $('.presenter').html(escape(this.presenter));
  $('.parent').html(this.parent.name);
  $(".template").html(escape(this.template));

  callback(null, $.html());
};