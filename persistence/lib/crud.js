module['exports'] = function (r) {
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
          return r.model.create(data, callback);
        }

        //
        // Other errors should be sent in the callback
        //
        return callback(err);
      }
      //
      // If the ID is not available, continue with error and existing result
      //
      return callback(new Error(result.id + ' already exists'), result);
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
    r.model.find(id, function(err, result){
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

    r.model.all({ where: query }, function(err, results){
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
    r.model.all({}, callback);
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
      r.model.updateOrCreate(options, function(err, updated){
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
        r.model.create(options, callback);
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
    r.model.find(id, function(err, result){
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
  return r;
}

