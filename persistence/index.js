var resource = require('resource'),
    persistence = resource.define('persistence');

persistence.schema.description = "enables persistence for resources";

persistence.method('enable', enable);

//
// Enables a resource to persistence by
// creating a JugglingDB model to back the resource,
// allowing the resource to be instantiable and backed by a datasource
//

function enable (r, options) {

    if(typeof options === "string") {
      options = {
        type: options
      };
    }

    //
    // Require JugglingDB.Schema
    //
    var Schema = require('./vendor/jugglingdb').Schema,
        uuid = require('node-uuid'),
        path = require('path');

    //
    // Map uuid library to persistence resource
    //
    persistence.uuid = uuid;

    //
    // Create new JugglingDB schema, based on incoming datasource type
    //
    var _type = mappings[options.type] || options.type || 'fs';
    resource.use(options.type)
    resource[options.type].start(function(){
      var schema = new Schema(_type, {
        database: options.name || "big",
        host: options.host,
        port: options.port,
        path: options.path || path.join(resource.helper.appDir, 'db'),
        username: options.username,
        password: options.password,
        options: options.options,
        https: true // TODO: check that HTTPS actually does something
      });

      //
      // Create empty schema object for mapping between resource and JugglingDB
      //
      var _schema = {};

      //
      // For every property in the resource schema, map the property to JugglingDB
      //
      Object.keys(r.schema.properties).forEach(function(p){
        var prop = r.schema.properties[p];
        _schema[p] = { type: jugglingType(prop) };
      });
      function jugglingType(prop) {
        var typeMap = {
          'string': String,
          'number': Number,
          'integer': Number,
          'array': JSON,
          'boolean': Boolean,
          'object': JSON,
          'null': null,
          'any': String
        };

        return typeMap[prop.type] || String;
      }

      //
      // Create a new JugglingDB schema based on temp schema
      //
      var Model = schema.define(r.name, _schema);

      //
      // Attach the CRUD methods to the resource
      //

      //
      // CREATE method
      //
      function create (data, callback) {
        //
        // If no id is specified, create one using node-uuid
        //
        if(typeof data.id === 'undefined' || data.id.length === 0) {
          data.id = uuid();
        }

        //
        // JugglingDB's "create" method can act like a "create or update"
        // depending on the adapter, even though JugglingDB has a separate code
        // path for "createOrUpdate" (for example, the cradle adapter has this
        // behavior). So, we use our internal "get" function to ensure that it does
        // not already exist.
        //
        // TODO: It is technically possible to have a uuid collision here,
        // though very unlikely.
        //
        get(data.id, function (err, result) {
          if (err) {
            //
            // "not found" errors are good in this case, so call create. Note that
            // this error message comes from the get function and not from
            // JugglingDB.
            //
            if (err.message.match(/not found/)) {
              return Model.create(data, callback);
            }

            //
            // Other errors should be sent in the callback
            //
            return callback(err);
          }
          return callback(new Error(data.id + ' already exists'));
        });
      }
      r.method('create', create, {
        "description": "create a new " + r.name,
        "properties": {
          "options": {
            "type": "object",
            "properties": r.schema.properties
          },
          "callback": {
            "type": "function"
          }
        }
      });

      //
      // Get method
      //
      function get (id, callback){
        // TODO: .all is now broken in fs adapter
        // NOTE: JugglingDB.find is really resource.get
        // NOTE: resource.get is JugglingDB.all with a filter
        Model.find(id, function(err, result){
          if(result === null) {
            return callback(new Error(id + ' not found'));
          }
          // TODO: check if any of the fields are keys, if so, fetch them
          callback(err, result);
        });
      }
      r.method('get', get, {
        "description": "get " + r.name +  " by id",
        "properties": {
          "id": {
            "type": "any",
            "description": "the id of the object",
            "required": true
          },
          "callback": {
            "type": "function"
          }
        }
      });

      //
      // Find method
      //
      function find (query, callback) {
        //
        // Remove any empty values from the query
        //
        for(var k in query) {
          if(query[k].length === 0) {
            delete query[k];
          }
        }

        Model.all({ where: query }, function(err, results){
          if (!Array.isArray(results)) {
            results = [results];
          }
          callback(err, results);
        });
      }

      var querySchema = {
        properties: {}
      }
      Object.keys(r.schema.properties).forEach(function(prop){
        if(typeof r.schema.properties[prop] === 'object') {
          querySchema.properties[prop] = {};
          for (var p in r.schema.properties[prop]) {
            querySchema.properties[prop][p] = r.schema.properties[prop][p];
          }
        } else {
          querySchema.properties[prop] = r.schema.properties[prop] || {};
        }
        querySchema.properties[prop].default = "";
        querySchema.properties[prop].required = false;
        //
        // TODO: remove the following two lines and make enum search work correctly
        //
        querySchema.properties[prop].type = "any";
        delete querySchema.properties[prop].enum;
        delete querySchema.properties[prop].format;
      });

      r.method('find', find, {
        "description": "search for instances of " + r.name,
        "properties": {
          "options": {
            "type": "object",
            "properties": querySchema.properties
          },
          "callback": {
            "type": "function"
          }
        }
      });

      //
      // All method
      //
      function all (callback) {
        Model.all({}, callback);
      }

      r.method('all', all, {
        "description": "gets all instances of " + r.name,
        "properties": {
          "callback": {
            "type": "function"
          }
        }
      });

      //
      // Update method
      //
      function update (options, callback){
        //
        // JugglingDB does not have a strict update and instead has
        // updateOrCreate, so do a get first and act accordingly
        //
        get(options.id, function (err, result) {
          if (err) {
            //
            // Unlike the case with strict create, "not found" errors mean we are
            // unable to do an update
            //
            return callback(err);
          }
          Model.updateOrCreate(options, function(err, updated){
            if(err) {
              return callback(err);
            }
            get(options.id, callback);
          });
        });
      }
      r.method('update', update, {
        "description": "updates a " + r.name + " by id",
        "properties": {
          "options": {
            "type": "object",
            "properties": r.schema.properties
          },
          "callback": {
            "type": "function"
          }
        }
      });

      //
      // Update or create
      //
      function updateOrCreate (options, callback) {
        if(typeof options.id === 'undefined' || options.id.length === 0) {
          options.id = uuid();
        }

        get(options.id, function(err, record){
          if (err) {
            Model.create(options, callback);
          } else {
            for (var p in options) {
              record[p] = options[p];
            }
            record.save(callback);
          }
        });

      }
      r.method('updateOrCreate', updateOrCreate, {
        "description": "updates a " + r.name + " by id, and creates if necessary",
        "properties": {
          "options": {
            "type": "object",
            "properties": r.schema.properties
          },
          "callback": {
            "type": "function"
          }
        }
      });

      //
      // Destroy method
      //
      function destroy (id, callback){
        Model.find(id, function(err, result){
          if (err) {
            return callback(err);
          }
          result.destroy(function(){
            callback(null, null);
          });
        });
      }
      r.method('destroy', destroy, {
        "description": "destroys a " + r.name + " by id",
        "properties": {
          "id": {
            "type": "string",
            "description": "the id of the object",
            "required": true
          },
          "callback": {
            "type": "function"
          }
        }
      });

      // assign model to resource
      r.model = Model;    });


}

//
// Provider API mapping for JugglingDB to datasource API for convenience
//
var mappings = {
  "couch": "cradle",
  "couchdb": "cradle"
};

persistence.dependencies = {
  "node-uuid": "*",
  "async": "*"
};

exports.persistence = persistence;