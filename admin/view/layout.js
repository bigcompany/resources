var layout = exports;
var view = require('view');

var controls = new view.View({ path: __dirname + '/controls', input: 'html' });
controls.load();

//
// Remark: Bind controls to layout for convience
//
layout.controls = controls;