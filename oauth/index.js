
var resource = require('resource'),
    oauth = resource.define('oauth');

oauth.property('credentials', {
  description: 'credentials for an oauth endpoint',
  properties: {
    requestUrl: {
      description: 'the requested service url',
      type: 'string',
      required: true
    },
    accessUrl: {
      description: 'the access url for said service',
      type: 'string',
      required: true
    },
    consumerKey: {
      type: 'string',
      required: true
    },
    consumerSecret: {
      type: 'string',
      required: true
    },
    version: {
      type: "string",
      required: true
    },
    authorize_callback: {
      description: "url to be sent back to on authorization",
      type: "string",
      required: true
    },
    signatureMethod: {
      type: "string",
      required: true
    }
  }
});

oauth.method('consumer', consumer, {
  description: 'creates oauth consumer',
  properties: {
    options: {
      type: "object",
      required: true,
        requestUrl: {
        description: 'the requested service url',
        type: 'string',
        required: true
      },
      accessUrl: {
        description: 'the access url for said service',
        type: 'string',
        required: true
      },
      consumerKey: {
        type: 'string',
        required: true
      },
      consumerSecret: {
        type: 'string',
        required: true
      },
      version: {
        type: "string",
        required: true
      },
      authorize_callback: {
        description: "url to be sent back to on authorization",
        type: "string",
        required: true
      },
      signatureMethod: {
        type: "string",
        required: true
      }
    }
  }
});

//A container for the generate oauth object
oauth.container = undefined;

function consumer (options) {
  if(oauth.container === undefined) {
    var OAuthWrapper = require('oauth').OAuth;
    resource.logger.info('creating oauth wrapper...');
    oauth.container = new OAuthWrapper(
      options.requestUrl,
      options.accessUrl,
      options.consumerKey,
      options.consumerSecret,
      options.version,
      options.authorize_callback,
      options.signatureMethod
    );
  }
  return oauth.container;
}

oauth.before('create', function(options, callback){
  oauth.requestToken(options, callback);
});

oauth.method('requestToken', requestToken, {
  description: 'authorize by oauth',
  properties: {
    callback: {
      required: true,
      "default": function (error, oauthToken, oauthTokenSecret, results) {
        if(error) {
          console.log(error);
        } else {
          console.log(oauthToken);
          console.log(oauthTokenSecret);
        }
      }
    }
  }
});

function requestToken (options, callback) {
  consumer(options).getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    callback(error, oauthToken, oauthTokenSecret, results);
  });
}

oauth.method('accessToken', accessToken, {
  description: 'get oauth Access Token',
  properties: {
    callback: {
      required: true,
      "default": function (error, accessToken, accessTokenSecrest, results) {
        if(error) {
          console.log(error);
        } else {
          console.log(accessToken);
          console.log(accessTokenSecrest);
        }
      }
    }
  }
});

function accessToken (requestToken, requestTokenSecret, callback) {
  consumer().getOAuthAccessToken(requestToken, requestTokenSecret, function(error, oauthAccessToken, oauthAccessTokenSecret, results){
    callback(error, oauthAccessToken, oauthAccessTokenSecret, results);
  });
}

exports.oauth = oauth;
exports.dependencies = {
  "oauth": "*"
};