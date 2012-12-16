//
// TODO: Provisioner resource
//

var resource = require('resource'),
    provisioner = resource.define('provisioner');

provisioner.schema.description = "for sending provisioners"

provisioner.method('provision', provision, {
  "description": "sends an provisioner",
  "properties": {
    "options": {
      "type": "object",
    },
    "callback": {
      "type": "function"
    }
  }
});

function provision (options) {
  var client = require('pkgcloud').providers.joyent.compute.createClient({
    provider: options.provider,
    account: options.account,
    username: options.username,
    password: options.password
  });
  
  client.getFlavors(function(err, flavors){
    //var flavor = flavors.pop();
    //console.log(flavors)
    client.getImages(function (err, images) {
      console.log(images)
    });
  });

  /*
  client.createServer({ name: 'big-0', type: "virtualmachine", memory: 512, disk: 15360 }, function (err, server) {
    console.log(err, server)
  });
  */

}

exports.dependencies = {
  "pkgcloud": "*"
};

exports.provisioner = provisioner;