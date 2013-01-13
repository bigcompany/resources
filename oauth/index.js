var resource = require('resource'),
    oauth = resource.define('oauth');

oauth.schema.description = "for managing oauth logins and tokens";

oauth.property('service', {
  description: 'the name of the service associated with this oauth token',
  type: "string"
});

oauth.property('requestUrl', {
  description: 'the requested service url',
  type: "string",
});

oauth.property('accessUrl', {
  description: 'the access url for said service',
  type: "string",
});

oauth.property('consumerKey', {
  type: "string",
});

oauth.property('consumerSecret', {
  type: "string",
});

oauth.property('version', {
  type: "string",
});

oauth.property('authorize_callback', {
  description: "url to be sent back to on authorization",
  type: "string",
});

oauth.property('signatureMethod', {
  type: "string",
  default: "HMAC-SHA1"
});


//A container for the generate oauth object
oauth.container = null;

oauth.method('start', start, {
  description: 'create an oauth object for authentication and requesting purposes',
  properties: {
    options: oauth.schema.properties,
    callback: {
      required: false,
      default: function () {}
    }
  }
});

function start (options, callback) {
  require('node-oauth').OAuth;
  oauth.container = new OAuth(
    options.requestUrl,
    options.accessUrl,
    options.consumerKey,
    options.consumerSecret,
    options.version,
    options.authorize_callback,
    options.signatureMethod
  );
  callback(null, options);
}

oauth.method('authorize', authorize, {
  description: 'authorize by oauth',
  properties: {
    options: oauth.schema.properties,
    callback: {
      required: false,
      default: function () {}
    }
  }
});

function authorize (options, callback) {
  oauth.container.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if(error) {
      console.log(error);
    }
    else {
      oa.getOAuthAccessToken(oauth_token, oauth_token_secret, function(error, oauth_access_token, oauth_access_token_secret, results2) {
        var data= "";
        console.log(oauth_access_token);
        console.log(oauth_access_token_secret);
      });
    }
  });
  callback(null, options);
}


exports.oauth = oauth;
exports.dependencies = {
  "node-oauth": "*"
};
