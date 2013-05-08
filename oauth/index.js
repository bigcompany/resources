var resource = require('resource'),
    oauth = resource.define('oauth');

oauth.schema.description = "for managing oauth providers and sessions";

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
    options: {
      type: "object",
      required: true,
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
    },
    callback: {
      required: true,
      "default": function (error, oauthToken, oauthTokenSecret, results) {
        if (error) {
          logger.error(error);
        }
        else {
          logger.info('oauth token:', oauthToken);
          logger.info('oauth token secret:', oauthTokenSecret);
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
  description: 'get oauth access token',
  properties: {
    options: {
      required: true,
      properties: {
        requestToken: {
          required: true
        },
        requestTokenSecret: {
          required: true
        },
        oauthVerifier: {
          required: false
        }
      }
    },
    callback: {
      required: true,
      "default": function (error, accessToken, accessTokenSecret, results) {
        if (error) {
          logger.error(error);
        }
        else {
          logger.info('oauth access token:', accessToken);
          logger.info('oauth access token secret:', accessTokenSecret);
        }
      }
    }
  }
});

function accessToken (options, callback) {
  consumer().getOAuthAccessToken(options.requestToken, options.requestTokenSecret, options.oauthVerifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results){
    callback(error, oauthAccessToken, oauthAccessTokenSecret, results);
  });
}

oauth.dependencies = {
  "oauth": "~0.9.8"
};

exports.oauth = oauth;