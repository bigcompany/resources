var resource = require('resource');

var path = require('path'),
    fs = require('fs');

var query = require('./query'),
    layout = require('./layout'),
    render = require('./render');

var View = function (options) {

  var self = this;

  options = options || {};

  self.viewPath = options.path || process.cwd();

  if (options.path) {
    self.viewPath      = options.path;
    self.templatePath  = self.viewPath + '/';
    self.presenterPath = self.viewPath + '/';
  }

  if (options.name) {
    self.name = options.name;
  } else {
    self.name = "";
  }

  if (options.template) {
    self.template = options.template;
    //
    // Remark: If we have been passed in a template as a string, the querySelectorAll context needs to be updated
    //
    self.$ = query(self.template);
  }

  if (options.presenter) {
    self.presenter = options.presenter;
  }

  if (options.parent) {
    self.parent = options.parent;
  }

  if (typeof options === "string") {
    this.load(options);
  }

  return this;
};

//
// Loads a template file or directory by path
//
View.prototype.load = function (viewPath, cb) {
  var self = this;

  //
  // TODO: better currying of args
  //
  if(typeof cb !== 'function' && typeof viewPath === 'function') {
    cb = viewPath;
  }

  if(typeof viewPath === "string") {
    self.viewPath = viewPath;
  }

  self.templatePath  = self.viewPath + '/';
  self.presenterPath = self.viewPath + '/';

  if (typeof cb !== 'function') {
    throw new Error("callback is required");
  }

  return self._loadAsync(cb);
};

View.prototype._loadAsync = function (cb) {

  var self = this,
  viewPath = self.viewPath,
  callbacks = 0;

  var root = self.viewPath;

  fs.readdir(root, function(err, dir) {
    if (err) {
      return cb(err);
    }
    dir.forEach(function(p) {
      fs.stat(root + '/' + p, function(err, stat) {
        if (stat.isDirectory()){
          delegate('dir', p);
        } else {
          delegate('file', p);
        }
      });
    });
   });

  function delegate (type, _path) {
    var ext = self.detect(_path),
        subViewName;

    subViewName = _path;

    if (type === "file") {

      subViewName = _path.replace(ext, '');

      //
      // increase the callback count
      //
      callbacks++;

      // determine if file is template or presenter ( presenters end in .js and are node modules )
      if (ext === ".js") {
        callbacks--;
        // don't do anything
      } else {

        //
        // load the file as the current template
        //
        fs.readFile(root + '/' + _path, function(err, result) {
          if (err) {
            throw err;
          }
          result = result.toString();
          var presenter, template;
          //
          // determine if file is template or presenter
          //
          template = result;

          //
          // get presenter, if it exists
          //
          var presenterPath = root +  '/' + _path.replace(ext, '.js');

          //
          // Determine if presenter file exists first before attempting to require it
          //
          // TODO: replace with async stat
          var exists = false;
          try {
            var stat = fs.statSync(presenterPath);
            exists = true;
          } catch (err) {
            exists = false;
          }

          if (exists) {
            presenterPath = presenterPath.replace('.js', '');
            presenter = require(presenterPath);
          }

          self[subViewName] = new View({
            name: subViewName,
            template: template,
            presenter: presenter,
            parent: self
          });

          callbacks--;
          if(callbacks === 0) {
            cb(null, self);
          }

        });
      }
    }

    if(type === "dir") {
      //
      // create a new subview
      //
      self[subViewName] = new View({
        name: subViewName,
        path: root + '/' + _path,
        parent: self
      });
      //
      // increase callback count
      //
      callbacks ++;
      //
      // load view
      //
      self[subViewName].load(function() {
        //
        // decrease callback count
        //
        callbacks--;
        if(callbacks === 0){
          cb(null, self);
        }
      });
    }
  }
  return;

};

View.prototype.present = function(options, callback) {

  var self = this;

  // if this is not a layout, do perform layout
  if (self.name !== "layout") {
    // load query
    self.$ = query(self.template);
    layout.call(self, self, options, function(err, result) {
      if (err)
        throw err;

      // update template and reload query
      self.$ = query(result);

      // if we have presenter, use it,
      // otherwise fallback to default presenter
      return (self.presenter || render).call(self, options, callback);
    });
  } else {
    // load query
    self.$ = query(self.template);

    // if we have presenter, use it,
    // otherwise fallback to default presenter
    return (self.presenter || render).call(self, options, function(err, result) {
      return callback(err, result);
    });
  }
};

//
// TODO: Detects view type based on current path
//
View.prototype.detect = function (p) {
  return path.extname(p);
};

View.prototype.breadcrumb = function () {
  if (typeof this.parent === "undefined") {
    return this.name;
  }
  return this.parent.breadcrumb() + '/' + this.name;
};

module['exports'] = View;