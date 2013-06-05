module['exports'] = function (options, callback) {

  var output = "", _control, v, 
  self = this,
  control = options.control;
  //
  // determine the type of control to render
  //
  _control = "string"; // forcing everything to string input as default for now

  if (control.private === true) {
    // do not render
    return callback(null, '');
  }

  if(control.type === "boolean") {
    _control = "boolean";
  }

  if(Array.isArray(control.enum)){
    _control = "enum";
  }

  if (typeof control.key !== 'undefined') {
    _control = "key";
  }

  //
  // determine if there is a View available for that type of control
  //
  if(typeof self.parent.parent.inputs[_control] === 'undefined') {
    throw new Error('invalid control ' + _control);
  }

  //
  // If there is an index.js available, use that as the presenter,
  // if not, use the control itself
  //
  v = self.parent.parent.inputs[_control].index || self.parent.parent.inputs[_control];

  // Present the View template
  v.present(options, callback);
}
