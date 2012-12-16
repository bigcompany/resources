var resource = require('resource');

resource.use('provisioner');

resource.provisioner.provision({
  username: "foofoo",
  password: "1234"
}, function (err, result) {
  console.log(err, result)
});
