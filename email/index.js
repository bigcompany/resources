var resource = require('resource'),
    email = resource.define('email');

email.schema.description = "for sending emails"

email.method('send', send);

function send (options) {
  
  console.log('send email stub', options);
  
};

exports.email = email;