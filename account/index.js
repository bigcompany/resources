var resource = require('resource'),
    account = resource.define('account');

account.schema.description = "for managing accounts"

account.persist('memory');

account.property('email', {
  "type": "string",
  "format": "email",
  "required": true
});

account.property('password', {
  "type": "string",
  "format": "password",
  "required": false
});

account.property('status', {
  "description": "the current status of the account",
  "type": "string",
  "enum": ["new", "active", "inactive", "disabled"],
  "default": "new"
});

account.property('token', {
  "description": "unique access token for the account. used for account confirmations and password resets",
  "type": "string",
  "private": true,
  "default": ""
});

account.method('confirm', confirm, {
  "description": "confirms a new account based on access token",
  "properties": {
    "token": {
      "type": "string",
      "description": "access token",
      "required": true,
      "message": "access token is required to confirm account"
    }
  }
});

account.method('reset', reset, {
  "description": "resets access token for account",
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "required": true
    }
  }
});

account.method('auth', auth, {
  "description": "checks id and password for an account ( auth check )",
  "properties": {
    "id": {
      "type": "string",
      "required": true
    },
    "password": {
      "type": "string",
      "required": true
    }
  }
});

account.before('create', function(_account, next) {
  //
  // Generate a new UUID for the account's access token
  //
  _account.token = resource.persistence.uuid();
  next(null, _account)
});

function auth (id, password, callback) {

  //
  // Lookup account by name and password
  //
  account.find({ id: id, password: password }, function(err, _account){
    if (err) {
      return callback(err);
    }
    if(_account.length === 0) {
      return callback(null, false);
    }
    return callback(null, true);
  })

}

function reset (email, callback) {
  account.find({ email: email }, function(err, _account){
    if (err) {
      return callback(err);
    }
    if(_account.length === 0) {
      return callback(new Error('could not find any accounts with email ' + email));
    }
    _account[0].token = resource.persistence.uuid();
    _account[0].save(function(err, result){
      if (err) {
        return callback(err);
      }
      return callback(null, result.token);
    });
  });
};

function confirm (token, callback) {
  account.find({ token: token }, function(err, _account){
    if (err) {
      return callback(err);
    }
    if(_account.length === 0) {
      return callback(new Error('could not find any accounts with token ' + token));
    }
    _account[0].status = "active";
    _account[0].save(callback);
  })
}

exports.account = account;