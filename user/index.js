var resource = require('resource'),
    user = resource.define('user');

user.schema.description = "for managing users"

user.property('email', {
  "type": "string",
  "format": "email",
  "required": true
});

user.property('password', {
  "type": "string",
  "format": "password"
});

user.property('status', {
  "description": "the current status of the user",
  "type": "string",
  "enum": ["new", "active", "inactive", "disabled"],
  "default": "new"
});

user.property('token', {
  "description": "unique access token for the user. used for account confirmations and password resets",
  "type": "string",
  "private": true,
  "default": ""
});

user.method('confirm', confirm, {
  "description": "confirms a new user based on access token",
  "properties": {
    "token": {
      "type": "string",
      "description": "access token",
      "required": true,
      "message": "access token is required to confirm account"
    }
  }
});

user.method('reset', reset, {
  "description": "resets access token for user",
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "required": true
    }
  }
});

user.before('create', function(_user, next){
  //
  // Generate a new UUID for the user's access token
  //
  _user.token = resource.uuid();
  next(null, _user)
});

function reset (email, callback) {
  user.find({ email: email }, function(err, _user){
    if (err) {
      return callback(err);
    }
    if(_user.length === 0) {
      return callback(new Error('could not find any users with email ' + email));
    }
    _user[0].token = resource.uuid();
    _user[0].save(function(err, result){
      if (err) {
        return callback(err);
      }
      return callback(null, result.token);
    });
  })
};

function confirm (token, callback) {
  user.find({ token: token }, function(err, _user){
    if (err) {
      return callback(err);
    }
    if(_user.length === 0) {
      return callback(new Error('could not find any users with token ' + token));
    }
    _user[0].status = "active";
    _user[0].save(callback);
  })
}

exports.user = user;