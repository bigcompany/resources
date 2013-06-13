var crypto = require('crypto');

var safeRequire = require('../utils').safeRequire;

/**
 * Module dependencies
 */
var cradle = safeRequire('cradle');

/**
 * Private functions for internal use
 */
function CradleAdapter(client) {
    this._models = {};
    this.client = client;
}

function createdbif(client, callback) {
    client.exists(function (err, exists) {
        if(err) callback(err);
        if (!exists) { client.create(function() { callback(); }); }
        else { callback(); }
    });
}

function naturalize(data, model) {
    data.nature = model;
    //TODO: maybe this is not a really good idea
    if(data.date) data.date = data.date.toString();
    return data;
}
function idealize(data) {
    data.id = data._id.replace(data.nature + '/', '');
    return data;
}
function stringify(data) {
    return data ? data.toString() : data 
}

function errorHandler(callback, func) {
   return function(err, res) {
      if(err) {
         callback(err);
      } else {
         if(func) {
            func(res, function(res) {
              callback(null, res);
            });
         } else {
            callback(null, res);
         }
      }
   }
};

function synchronize(functions, args, callback) {
   if(functions.length === 0) callback();
   if(functions.length > 0 && args.length === functions.length) {
       functions[0](args[0][0], args[0][1], function(err, res) {
          if(err) callback(err);
          functions.splice(0, 1);
          args.splice(0, 1);
          synchronize(functions, args, callback);
       });
   }
};

function numerically(a, b) {
   return a[this[0]] - b[this[0]];
}

function literally(a, b) {
   return a[this[0]] > b[this[0]];
}

function sorting(res, model, filter, instance) {
   // do we need some sorting?
   if (filter.order) {
      var props = instance[model].properties;
      var allNumeric = true;
      var orders = filter.order;
      var reverse = false;
      if (typeof filter.order === "string") {
         orders = [filter.order];
      }

      orders.forEach(function (key, i) {
         var m = key.match(/\s+(A|DE)SC$/i);
         if (m) {
            key = key.replace(/\s+(A|DE)SC/i, '');
            if (m[1] === 'DE') reverse = true;
         }
         orders[i] = key;
         if (props[key].type.name !== 'Number') {
            allNumeric = false;
         }
      });
      if (allNumeric) {
         res = res.sort(numerically.bind(orders));
      } else {
         res = res.sort(literally.bind(orders));
      }
      if (reverse) res = res.reverse();
   }
   return res;
}

/**
 * Connection/Disconnection
 */
exports.initialize = function(schema, callback) {
    if (!cradle) return;

    if (!schema.settings.url) {
        var host = schema.settings.host || 'localhost';
        var port = schema.settings.port || '5984';
        var options = schema.settings.options || {
           cache: true,
           raw: false
        };
        if (schema.settings.username) {
            options.auth = {};
            options.auth.username = schema.settings.username;
            if (schema.settings.password) {
                options.auth.password = schema.settings.password;
            }
        }
        var database = schema.settings.database || 'jugglingdb';

        schema.settings.host = host;
        schema.settings.port = port;
        schema.settings.database = database;
        schema.settings.options = options;
    }
    schema.client = new(cradle.Connection)(schema.settings.host, schema.settings.port,schema.settings.options).database(schema.settings.database);
    
    // TODO: fix
    schema.adapter = new CradleAdapter(schema.client);

    createdbif(
       schema.client,
       errorHandler(callback, function() {
          schema.adapter = new CradleAdapter(schema.client);
          process.nextTick(callback);
       }));
};

CradleAdapter.prototype.disconnect = function() {
};

/**
 * Write methods
 */
CradleAdapter.prototype.define = function(descr) {
    this._models[descr.model.modelName] = descr;
};

CradleAdapter.prototype.create = function(model, data, callback) {
    data.id = model + '/' + data.id;
    naturalize(data, model)
    this.client.save(
       stringify(data.id),
       naturalize(data, model),
       errorHandler(callback, function(res, cb) {
          res.id = res.id.replace(model + '/', '');
          cb(res.id);
       })
    );
};

CradleAdapter.prototype.save = function(model, data, callback) {
   data.id = model + '/' + data.id;
   this.client.save(
       stringify(data.id),
       naturalize(data, model),
       errorHandler(callback)
   )
};

CradleAdapter.prototype.updateAttributes = function(model, id, data, callback) {
    this.client.merge(
       stringify(data.id),
       data,
       errorHandler(callback, function(doc, cb) {
          cb(idealize(doc));
       })
    );
};

CradleAdapter.prototype.updateOrCreate = function(model, data, callback) {
   data.id = model + '/' + data.id;
   this.client.get(
      stringify(data.id),
      function (err, doc) {
         if(err) {
            this.create(model, data, callback);
         } else {
            this.updateAttributes(model, data.id, data, callback);
         }
      }.bind(this)
   )
};

/**
 * Read methods
 */
CradleAdapter.prototype.exists = function(model, id, callback) {
    this.client.get(
       stringify(id), 
       errorHandler(callback, function(doc, cb) {
          cb(!!doc);   
       })
    );
};

CradleAdapter.prototype.find = function(model, id, callback) {
    id = model + '/' + id;
    this.client.get(
       stringify(id),
       errorHandler(callback, function(doc, cb) {
          cb(idealize(doc));
       })
    );
};

CradleAdapter.prototype.count = function(model, callback, where) {
    this.models(
       model,
       {where: where},
       callback,
       function(docs, cb) {
          cb(docs.length);
       }
    );
};

var views = {};
CradleAdapter.prototype.models = function(model, filter, callback, func) {
    var limit = 200;
    var skip  = 0;
    if (filter != null) {
        limit = filter.limit || limit;
        skip  = filter.skip ||skip;
    }

    var self = this;

    if(model) {
       if(filter == null) filter = {};
       if(filter.where == null) filter.where = {};
       filter.where.nature = model;
    }

    if (filter.where.id) {
      filter.where.id = model + '/' + filter.where.id;
    }

    _view(model, filter, errorHandler(callback, function(res, cb) {
        var docs = res.map(function(doc) {
            return idealize(doc);
        });

        var sorted = sorting(docs, model, filter, this._models)

        func ? func(sorted, cb) : cb(sorted);
    }.bind(self)));

    function _view(model, filter, callback) {
        var view = getView(model, filter);

        self.client.view(model+'/'+view.name, {include_docs:true, limit:limit, skip:skip}, function (err, res) {
            if (err && err.error === 'not_found') {

                return self.client.save('_design/'+model, {
                    views: getViews(model)
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    _view(model, filter, callback);
                });
                return callback(err);
            }

            callback(null, res);
        });

    }

    function getView(model, filter) {
        var name,
            fxn;

        if (typeof filter.where === 'function') {
            if (filter.where.name) {
                name = filter.where.name;
            }
            else {
                name = md5(filter.where.toString());
            }
        }

        if (filter.name) {
          name = filter.name;
        }

        var keys = Object.keys(filter.where);

        if (keys.length === 1 && keys.indexOf('nature') !== -1) {
            name = 'all';
        }

        if (!name) {
            name = md5(JSON.stringify(filter.where));
        }

        // this is not the most readable way to generate unique one-way ids
        function md5(str) {
            return crypto
                .createHash('md5')
                .update(str)
                .digest('hex')
            ;
        }

        if (views[name]) {
          return {name:name, model:model, view:views[name]};
        }
        var view = {
            name: name,
            model:model,
            view: getMap(filter)
        };

        views[name] = view;

        return view;
    }

    function getMap(filter) {
        if (typeof filter.where === 'function') {
            // function (doc) with emit() calls
            return filter.where.toString();
        }

        return [
            "function (doc) {",
            "    var pass = true;",
            "    var where = "+JSON.stringify(filter.where)+";",
            "",
            "    Object.keys(where).forEach(function (key) {",
            "        if (!test(where[key], doc[key])) {",
            "            pass = false;",
            "        }",
            "        function test(example, value) {",
                        // Couch doesn't have an obvious way to send regexp "examples"
                        /*
                        if (typeof value === 'string' && example && example.constructor.name === 'RegExp') {
                            return value.match(example);
                        }
                        */

            "            // not strict equality",
            "            return example == value;",
            "        }",
            "",
            "    });",
            "    if (pass) {",
            "        emit(doc._id, doc);",
            "    }",
            "};"
        ].join('\n');
    }

    function getViews(model) {
        var vs = {};

        Object.keys(views).forEach(function (k) {
            var v = views[k];

            if (v.model === model) {
                vs[v.name] = { map: v.view };
            }
        });

        return vs;
    }
};

CradleAdapter.prototype.all = function(model, filter, callback) {
   this.models(
       model,
       filter,
       callback
   );
};

/**
 * Detroy methods
 */
CradleAdapter.prototype.destroy = function(model, id, callback) {
    id = model + '/' + id;

    var self = this;

    if (this.client.connection.options.cache) {
        this.client.remove(
            id,
            function (err, doc) {
                callback(err);
            }
        );
    }
    else {
        this.client.get(
            stringify(id),
            function (err, doc) {
                if (err) {
                    return callback(err);
                }
                self.client.remove(
                    doc.id,
                    doc._rev,
                    function (err, doc) {
                        callback(err);
                    }
                );
            }
        );
    }
};

CradleAdapter.prototype.destroyAll = function(model, callback) {
   this.models(
       model,
       null,
       callback,
       function(docs, cb) {
          var docIds = docs.map(function(doc) {
             return doc.id;                     
          });
          this.client.get(docIds, function(err, res) {
             if(err) cb(err);

             var funcs = res.map(function(doc) {
                return this.client.remove.bind(this.client);
             }.bind(this));

             var args = res.map(function(doc) {
                return [doc._id, doc._rev];
             });

             synchronize(funcs, args, cb);
          }.bind(this));
       }.bind(this)
   );
};
