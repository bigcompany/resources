var resource = require('resource'),
    docs = resource.define('docs'),
    path = require('path'),
    fs = require('fs'),
    viewModule = require('viewful');

docs.schema.description = "for generating documentation";

docs.method('generate', generate, {
  "description": "generates markdown documentation for a single resource",
  "properties": {
    "resource": {
      "description": "the resource to generate documentation for",
      "type": "any"
    },
    "template": {
      "type": "string",
      "default": __dirname + '/template.md'
    }
  }
});

docs.method('build', build, {
  "description": "builds README.md files for all resources"
});

docs.all = function (resources) {
  var str = '';
  for(var r in resources) {
    str += docs.generate(resources[r]) + '\n\n';
  }
  return str;
};

function generate (_resource, template, callback) {

  if(typeof _resource === "string") {
    _resource = resource.resources[_resource];
  }

  template = fs.readFileSync(__dirname + '/template.md').toString();
  var view = new viewModule.View({
    template: template, 
    input: "swig"
  });

  viewModule.engines.swig.init({
      autoescape: false
  });

  var data = {
    toc: tableOfContents(_resource),
    name: _resource.name + '\n',
    desc: _resource.schema.description,
    usage: resourceUsage(_resource),
    properties: resourceProperties(_resource),
    methods: resourceMethods(_resource),
    dependencies: resourceDeps(_resource),
    footer: generateFooter()
  };

  var s = view.render(data);

  if(callback) {
    return callback(null, s);
  } else {
    return s;
  }

};

function resourceProperties (resource) {
  var str = '';
  
  if(typeof resource.schema === 'undefined' || typeof resource.schema.properties === 'undefined') {
    return str;
  }
  
  if(Object.keys(resource.schema.properties).length > 1) {
    str += '<a name="' + resource.name + '-properties"></a>\n\n';
    str += '## properties \n';
  }

  str += schemaToTable(resource.schema);

  return str;
}

function resourceDeps (resource) {
  var list = '## dependencies \n';
  for(var d in resource.dependencies) {
    list += "- [" + d + "](http://npmjs.org/package/" + d + ")\n";
  }
  return list;
}

//
// Generates Markdown documentation for resource methods
//
function resourceMethods (resource) {
  var str = '';

  str += '<a name="' + resource.name + '-methods"></a> \n\n';
  str += '## methods \n\n';

  if(typeof resource.methods === 'undefined') {
    return str;
  }

  for ( var m in resource.methods ) {
    if(typeof resource.methods[m] === "function") {
      //
      // Create temp _args array to create simple list of "top-level" method arguments
      //
      var _args = [];
      if(typeof resource.methods[m].schema === 'object' && typeof resource.methods[m].schema.properties === 'object') {
        Object.keys(resource.methods[m].schema.properties).forEach(function(prop){
          _args.push(prop);
        });
      }
      str += '<a name="' + resource.name + '-methods-' + m +'"></a> \n\n';
      str += ('### ' + resource.name + '.' + m + '(' + _args.join(', ') +')\n\n');
      //
      // Show method schema properties
      //
      str += schemaToTable(resource.methods[m].schema);
    }
  }
  return str;
}

var schemaToHTML = docs.schemaToHTML = function (schema) {

  var str = schemaToTable(schema)
  var view = new viewModule.View({
    template: str,
    input: "markdown"
  });
  return view.render();

}

//
// Converts a schema into a nested markdown ul / li
//
var schemaToTable = docs.schemaToTable = function (schema) {

  var str = '';

  function props (properties, level) {

    var pad = '';

    for(var i = 0; i < level; i++) {
      pad += '  ';
    }

    var str = '';

    if(typeof properties !== "object") {
      return str;
    }

    Object.keys(properties).forEach(function(p){
      var prop = properties[p];
      if(typeof prop === 'object') {
        str += pad + '- **' + p + '** \n\n';
        if(p === 'enum') {
          return str += pad + '  - enum : *["' + prop.join('", "') + '"]*\n\n';
        }
        for(var o in prop) {
          // enum is a special case, format the array flat ( so it doesnt take up a bunch of vertical space in the layout )
          if(typeof prop[o] !== "object") {
            str += pad + '  - **' + o + '** : ' + prop[o] + '\n\n';
          } else {
            str += pad + '  - **' + o + '**\n\n';
            str += props(prop[o], level + 2);
          }
        }
      } else {
        str += pad + '- ' + p  + ' : *' + prop + '*\n\n';
      }
    });
    return str;
  };
  
  if(typeof schema === 'object' && typeof schema.properties === 'object' ) {
    str += ( schema.description || '' ) + "\n\n";
    str += props(schema.properties, 0);
  }
  return str;
  
};

function resourceUsage (resource) {
  var str = '';
  str += ('    ' + 'var resource = require("resource");\n');
  str += ('    ' + 'resource.use("' + resource.name + '");\n');
  return str;
}

function tableOfContents (resource) {

  // Header
  var str = '## API\n\n';

  if(typeof resource.schema === 'undefined' || typeof resource.schema.properties === 'undefined') {
    return str;
  }

  // Properties
  str += '#### [properties](#' + resource.name + '-properties)' + '\n\n';
  Object.keys(resource.schema.properties).forEach(function(r){
    str += '  - [' + r + '](#' + resource.name + '-properties-' + r + ')\n\n';
  });
  str += '\n';

  // Methods
  str += '#### [methods](#' + resource.name + '-methods)' + '\n\n';
  for (var m in resource.methods) {
    var _args = [];
    if(typeof resource.methods[m].schema === 'object' && typeof resource.methods[m].schema.properties === 'object') {
      Object.keys(resource.methods[m].schema.properties).forEach(function(prop){
        _args.push(prop);
      });
    }
    str += ('  - [' + m + '](#' + resource.name + '-methods-' + m + ') (' + _args.join(', ') +')\n\n');
  }

  return str;
};

function generateFooter() {
  var str = '';
  str += ('*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*');
  return str;
}

function build () {
  var _resources = {};
  var dirs = fs.readdirSync(__dirname + '/../');
  //
  // Generate a README file for every resource
  //
  dirs.forEach(function(p){
    var stat;
    try {
      stat = fs.statSync(__dirname + '/../' + p + '/' + "index" + '.js');
    } catch(err) {
      // TODO: better filtering of /resources/ folder to prevent attempts to read .git, .DS_Store, etc
      //console.log(err)
    }
    if(stat) {
      _resources[p] = {};
      var str = p.substr(0, 1);
      str = str.toUpperCase();
      var P = str + p.substr(1, p.length - 1);
      resource.logger.warn('attempting to require ' + p.magenta)

      var _resource = resource.use(p);

      //
      // Generate the docs
      //
      var doc = resource.docs.generate(_resource, fs.readFileSync(__dirname + '/template.md').toString());
      //
      // Write them to disk
      //
      var _path = __dirname + '/../' + p + '/README.md';

      try {
        fs.writeFileSync(_path, doc);
        resource.logger.info('wrote to ' + path.resolve(_path));
      } catch(err) {
        console.log(err)
      }
    }
  });

  //
  // Then generate a README file for the core project
  //
  var str = '# resources \n\n';
  str += 'resources for any occasion \n\n'
  Object.keys(_resources).forEach(function(r){
    str += ' - [' + r + '](https://github.com/bigcompany/resources/tree/master/' + r +') ' + resource.resources[r].schema.description + '\n';
  });
  fs.writeFileSync(__dirname + '/../README.md', str);
  resource.logger.info('wrote to core resource README.md file');
}

exports.docs = docs;

exports.dependencies = {
  "view": "*"
};