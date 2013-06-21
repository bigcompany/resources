var resource = require('resource'),
    docs = resource.define('docs'),
    path = require('path'),
    fs = require('fs');

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

  // check to see if /docs are available
  var docsPath = path.normalize(require.resolve('resources') + "/../" + _resource.name + '/docs'),
      parts = '',
      docs;

  try {
    docs = fs.readdirSync(docsPath);
  } catch (err) {
  // no docs folder found, do nothing
  }

  if (docs) {
  // iterate through every file looking for markdown
  docs.forEach(function(doc){
    parts += '\n' + fs.readFileSync(docsPath + '/' + doc).toString() + '\n\n';
  });
  }

  var data = {
    toc: tableOfContents(_resource),
    name: _resource.name + '\n',
    parts: parts,
    desc: _resource.schema.description,
    usage: resourceUsage(_resource),
    properties: resourceProperties(_resource),
    methods: resourceMethods(_resource),
    dependencies: resourceDeps(_resource),
    footer: generateFooter()
  };

  for (var p in data) {
    template = template.replace("{{" + p + "}}", data[p]);
  }

  if(callback) {
    return callback(null, template);
  } else {
    return template;
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
  var list = '';
  if (typeof resource.dependencies === 'object' && Object.keys(resource.dependencies).length > 0) {
    list = '## dependencies \n';
    for(var d in resource.dependencies) {
      var version = "";
      if(resource.dependencies[d] !== "*") {
        version = " v" + resource.dependencies[d];
      }
      list += "- [" + d + "](http://npmjs.org/package/" + d + ")" + version + "\n";
    }
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

  var str = schemaToTable(schema);
  var view = new view.View({
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

  if(typeof schema === 'object'){
    str += ( schema.description || '' ) + "\n\n";
    if(typeof schema.properties === 'object' ) {
      str += props(schema.properties, 0);
    }
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

  //
  // TODO: Remove duplicate resource loading code here in favor of require('resources')
  //
  var _resources = {},
      resources = require('resources');

  //
  // Attempt to load /resources/ folder from current resources directory
  //
  var resourcesPath = (path.resolve(require.resolve('resources') + '/../'));
  var dirs = fs.readdirSync(resourcesPath);

  //
  // Generate a README file for every resource
  //
  dirs.forEach(function(p){
    var stat,
        resourcePath,
        resourceModule;

    resourcePath = resourcesPath + '/' + p;

    //
    // Check if path is actually a resource
    //
    if (resource.isResource(resourcePath)) {
      // resource.logger.warn('attempting to require ' + resourcePath)
      //
      // If file is a resource, then attempt to generate documentation for it
      //
      try {

        var _resource = require(resourcesPath + '/' + p);
        _resources[p] = {};
        if(typeof _resource[p] !== 'undefined') {
          _resource = _resource[p];

          //
          // Generate resource documentation
          //
          var doc = resource.docs.generate(_resource, fs.readFileSync(__dirname + '/template.md').toString());

          //
          // Write resource documentation to disk
          //
          var _path = resourcePath + '/README.md';

          fs.writeFileSync(_path, doc);
          resource.logger.info('wrote resource documentation: ' + path.resolve(_path).grey);
        }
      } catch(err) {
        delete _resources[p];
        resource.logger.error('could not generate documentation for resource: ' + p);
        console.log(err)
      }
    }
  });

  //
  // Generate a "global" README file for all resources
  //
  var str = '# resources - prerelease \n\n';
  str += 'resources for any occasion \n\n';
  Object.keys(_resources).forEach(function(r) {
    str += ' - [' + r + '](https://github.com/bigcompany/resources/tree/master/' + r +') ' + resource.resources[r].schema.description + '\n';
  });
  fs.writeFileSync(resourcesPath + '/README.md', str);
  resource.logger.info('wrote to core resource README.md file');
}

exports.docs = docs;
