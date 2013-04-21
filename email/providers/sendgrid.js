//
// TODO: sendgrid.js - simple wrapper to sendgrid api or sendgrind npm module
//
var sendgrid = exports;

sendgrid.send = function (options, callback) {
  console.log('sending email through sendgrid provider');
  callback(null, true)
};