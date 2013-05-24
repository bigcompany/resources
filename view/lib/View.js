var resource = require('resource');

var path = require('path'),
    fs = require('fs');

var query = require('./query'),
    layout = require('./layout');

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

  if (options.present) {
    self.present = options.present;
  }

  if (options.parent) {
    self.parent = options.parent;
  }

  if (typeof options === "string") {
    this.load(options);
  }

  this.input = options.input || 'html';
  this.output = "html";

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
        input,
        subViewName;

    subViewName = _path;

    if (type === "file") {

      subViewName = _path.replace(ext, '');

      //
      // increase the callback count
      //
      callbacks ++;

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
          // Perform layout code on template
          //
          return layout.render(self, template, function(err, str) {
            template = str;
            self.$ = query(template);
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
            } else {
              presenter = function (data, callback) {
                if (typeof callback === "function") {
                  callback(null, self.$.html());
                } else {
                  return self.$.html();
                }
              };
            }

            self[subViewName] = new View({
              template: template,
              input: self.input,
              present: presenter,
              parent: self
            });

            callbacks--;
            if(callbacks === 0){
              cb(null, self);
            }
          });

        });
      }

    }

    if(type === "dir") {
      //
      // create a new subview
      //
      self[subViewName] = new View({
        path: root + '/' + _path,
        input: self.input,
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