var resource = require('resource'),
github = resource.define('github');

github.schema.description = "for interacting with the Github.com API";

github.method('activity', activity, {
  "description": "gets event activity for a user or organization",
  "properties": {
    "options": {
      "properties": {
        "user": {
          "type": "string"
        },
        "org": {
          "type": "string"
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

function activity (options, callback) {
  var gh = require('github');
  var conn = new gh({
    version: "3.0.0"
  });

  if (options.authenticate) {
    conn.authenticate(options.authenticate);
  }

  //
  // TODO: better conditional logic for determing user / org / project / etc
  //
  if (typeof options.user !== "undefined" && options.user.length > 0) {
    return conn.events.getFromUser({
      user: options.user
    }, function(err, result) {
      callback(err, result);
    });
  }

  if (typeof options.org !== "undefined" && options.org.length > 0) {
    return conn.events.getFromOrg({
      org: options.org
    }, function(err, result) {
      callback(err, result);
    });
  }

  callback(new Error('nothing to get'));
}

github.dependencies = {
  "github": "*"
};

exports.github = github;