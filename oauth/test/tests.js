var tap = require("tap")
  , test = tap.test
  , plan = tap.plan
  , oauth = require('../index.js').oauth;


var credentials = {
    requestUrl: "http://term.ie/oauth/example/request_token.php",
    accessUrl: "http://term.ie/oauth/example/access_token.php",
    consumerKey: "key",
    consumerSecret: "secret",
    version: "1.0",
    authorize_callback: "",
    signatureMethod: "HMAC-SHA1"
};

var requestTokens = {
  requestToken: 'requestkey',
  requestTokenSecret: "requestsecret"
};

test("container should be undefined to start", function (t) {
  t.equal(oauth.container, undefined);
  t.end();
});

test("credentials should be awaiting definitions", function (t) {
  t.type(oauth.schema.properties.credentials, Object);
  t.end();
});

test("credentials requestUrl should be required", function (t) {
  t.ok(oauth.schema.properties.credentials.properties.requestUrl.required,
  "required");
  t.end();
});

test("credentials accessUrl should be required", function (t) {
  t.ok(oauth.schema.properties.credentials.properties.accessUrl.required,
  "required");
  t.end();
});

test("credentials consumerKey should be required", function (t) {
  t.ok(oauth.schema.properties.credentials.properties.consumerKey.required,
  "required");
  t.end();
});

test("credentials consumerSecret should be required", function (t) {
  t.ok(oauth.schema.properties.credentials.properties.consumerSecret.required,
  "required");
  t.end();
});

test("credentials version should be required", function (t) {
  t.ok(oauth.schema.properties.credentials.properties.version.required,
  "required");
  t.end();
});

test("credentials authorize_callback should be required", function (t) {
  t.ok(oauth.schema.properties.credentials.properties.authorize_callback.required,
  "required");
  t.end();
});

test("credentials signatureMethod should be required", function (t) {
  t.ok(oauth.schema.properties.credentials.properties.signatureMethod.required,
  "required");
  t.end();
});

test("consumer should throw an error with incomplete properties", function (t) {
  oauth.consumer(undefined, function(err, result){
    t.equal(err.errors[0].attribute, 'required', 'did not create consumer - err.errors[0].attribute = "required"');
    t.equal(err.errors[0].actual, undefined, 'did not create consumer- err.errors[0].actual = undefined');
    t.end();
  });

test("consumer returns consumer", function (t) {
    t.type(oauth.consumer(credentials), Object);
    t.end();
  });

test("requestToken returns request token in call back", function (t) {
    oauth.requestToken(credentials, function(error, oauthToken, oauthTokenSecret, results){
      if (error) {
            logger.error(error.message);
            logger.error(error.stack);
          } else {
      t.equal(oauthToken, 'requestkey');
      t.end();
    }
    });
  });

  test("requestToken returns request token in call back", function (t) {
    oauth.requestToken(credentials, function(error, oauthToken, oauthTokenSecret, results){
      if (error) {
            logger.error(error.message);
            logger.error(error.stack);
          } else {
      t.equal(oauthTokenSecret, 'requestsecret');
      t.end();
    }
    });
  });

  test("accessToken returns access token in call back", function (t) {
    oauth.consumer(credentials);
    oauth.accessToken(requestTokens, function(error, oauthToken, oauthTokenSecret, results){
        if (error) {
          console.log(error.message);
          console.log(error.stack);
        } else {
      t.equal(oauthToken, 'accesskey');
      t.end();
    }
    });
  });

  test("accessToken returns access token in call back", function (t) {
    oauth.consumer(credentials);
    oauth.accessToken(requestTokens, function(error, oauthToken, oauthTokenSecret, results){
        if (error) {
          console.log(error.message);
          console.log(error.stack);
        } else {
      t.equal(oauthTokenSecret, 'accesssecret');
      t.end();
    }
    });
  });

  test("accessToken can take an optional verifier url", function (t) {
    oauth.consumer(credentials);
    requestTokens['oauthVerifier'] = 'http://www.example.com';
    oauth.accessToken(requestTokens, function(error, oauthToken, oauthTokenSecret, results){
        if (error) {
          console.log(error.message);
          console.log(error.stack);
        } else {
      t.equal(oauthTokenSecret, 'accesssecret');
      t.end();
    }
    });
  });

});