//
// resources
//
var resource = require('resource'),
    resources = resource.define('resources'),
    fs = require('fs');
    
fs.readdir(__dirname, function(err, results) {
  
  results.forEach(function(result){
    try {
      var s = fs.statSync(__dirname + '/' + result);
      if(s.isDirectory()) {
        resource.use(result);
      }
    } catch (err) {
      console.log(err)
    }
    
  });
  
  
//  console.log(err, results);
})

exports.resources = resources;