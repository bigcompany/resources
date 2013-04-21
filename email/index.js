var resource = require('resource'),
    email = resource.define('email');

email.schema.description = "for sending emails"

email.method('send', require('./send'), {
  "description": "sends an email",
  "properties": {
    "options": {
      "type": "object",
      "properties": email.schema.properties
    },
    "callback": {
      "type": "function"
    }
  }
});

email.property('to', {
  "type": "string",
  "description": "where the email will be sent to"
});

email.property('from', {
  "type": "string",
  "description": "where the email will be sent from"
});

email.property('subject', {
  "type": "string",
  "description": "the subject of the email"
});

email.property('cc', {
  "type": "string",
  "description": "where to send carbon copies"
});

email.property('bcc', {
  "type": "string",
  "description": "where to send blind carbon copies"
});

email.property('body', {
  "type": "string",
  "description": "the content of the email"
});

exports.email = email;