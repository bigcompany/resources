var viewful = require('../../lib/viewful');

var view = new viewful.View({
  path: "./examples/jade/view",
  input: "jade"
});

view.load(function(err, result){
  if(err) {
    return console.log(err);
  }

  //
  // Remark: You could just as easily use a sync view.create.render call here too
  //
  view.creature.create.render({ user: { name: "bob", email: "bob@marak.com" }}, function(err, result){
    console.log(err, result)
  });

  view.creature.inputs.button.render({ label: 'fudge'}, function(err, result){
    console.log(err, result)
  });

  
});
