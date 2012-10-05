module.exports = function (options, callback) {
  // Remark: We get an isomorphic querySelectorAll poly-fill for free!
  console.log('sup')
  var $ = this.$;
  $('#thebutton').click(function(){
    alert('I am alert!');
  })
}