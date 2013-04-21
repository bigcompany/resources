//
// send.js - exports a single send method for sending an email
//
module['exports'] = function (options, callback) {
  console.log('send email stub', arguments);
  //
  // TODO: If new email providers are required, make providers pluggable
  //
  var sendgrid = require('./providers/sendgrid');
  sendgrid.send(options, callback);
}