var resource = require('resource');

var path = require('path'),
    fs = require('fs');

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
    self.$ = View.detectQuerySelector(self.template);
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

  console.log(this);
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

var layout = require('./layout');

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

      var lastPresenter =  function (data, callback) {
        if(typeof callback === "function") {
          callback(null, this.$.html());
        } else {
          return this.$.html();
        }
      };

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
          /*return layout.render(self, template, function(err, str) {
            template = str;*/
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
              lastPresenter = require(presenterPath);
            }

            self[subViewName] = new View({
              template: template,
              input: self.input,
              present: lastPresenter,
              parent: self
            });

            callbacks--;
            if(callbacks === 0){
              cb(null, self);
            }
          });

        //});
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
      self[subViewName].load(function(callback) {
        //
        // decrease callback count
        //
        callbacks--;
        console.log(callbacks);
        if(callbacks === 0){
          cb(null, callback(null, self));
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

/* TODO: Remove this unless we will need async loading for start
viewful.engines.init(function (err) {
  if (err) {
    console.log(err);
  }
});
*/

View.prototype.breadcrumb = function () {
  if (typeof this.parent === "undefined") {
    return this.name;
  }
  return this.parent.breadcrumb() + '/' + this.name;
};

View.detectQuerySelector = function (template) {
  //
  // TODO: Add better feature detection here for $
  //
  var $,
      cheerio;

  try {
   cheerio = require('cheerio');
  } catch (err) {
    // Do nothing
  }

  //
  // Detected server-side node.js, use cheerio
  //
  if(typeof cheerio !== 'undefined') {
    $ = cheerio;
  }
  else
  {
    $ = function(){};
  }

  if(typeof $.load === 'function') {
    $ = $.load(result);
  return $;

  //
  // Detected client-side jQuery, use jQuery
  //
  // TODO

  //
  // Detected client-side querySelectorAll, using querySelectorAll
  //
  // TODO

  //
  // Client-side, but no $ found. Using Zepto fallback
  //
  // TODO
  }
};

module['exports'] = View;