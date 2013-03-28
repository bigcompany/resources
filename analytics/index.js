var resource = require("resource"),
analytics = resource.define("analytics")
fs = require('fs');

analytics.schema.description = "real-time analytics by google";

var inject = function (gid, callback) {
  var template = fs.readFileSync(__dirname + '/template.js').toString();
  template = template.replace('{{GID}}', gid);
  if (callback) {
    return callback(null, template);
  } else {
    return template;
  }
}

analytics.method('inject', inject, {
  "description": "returns templatizaed google adsense javascript embed based on account id",
  "properties": {
    "accountID" : {
      "type": "string",
      "required": true,
      "default": "UA-XXXXX-Y"
    }
  }
});

exports.analytics = analytics;