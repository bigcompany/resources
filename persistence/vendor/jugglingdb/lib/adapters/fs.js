var safeRequire = require('../utils').safeRequire;
var nosqlite = require('../nosqlite');

var mkdirp = safeRequire('mkdirp');

exports.initialize = function initializeSchema(schema, callback) {
    schema.adapter = new Fs(schema.settings);
    process.nextTick(callback);
};

function Fs (options) {
    options = options || {};
    //
    // Choose a sane default for options.path
    //
    options.path = options.path || process.cwd() + '/db/';

    //
    // Ensure that the "db" directory exists before trying to use it
    //
    mkdirp.sync(options.path);

    this._models = {};
    this.cache = {};
    this.ids = {};
    this.connection = new(nosqlite.Connection)(options.path);
}

Fs.prototype.define = function defineModel(descr) {
    var m = descr.model.modelName;
    this._models[m] = descr;
    this.cache[m] = {};
    this.ids[m] = 1;
};

Fs.prototype.create = function create(model, data, callback) {
    var id = data.id || this.ids[model]++;
    data.id = id;
    var db = this.connection.database(model);
    db.create(function(){
      db.post(data, function(err, result){
        callback(err, data.id);
      })
    });
};

Fs.prototype.updateOrCreate = function (model, data, callback) {
    var mem = this;
    this.exists(model, data.id, function (err, exists) {
        if (exists) {
            mem.save(model, data, callback);
        } else {
            mem.create(model, data, function (err, id) {
                data.id = id;
                callback(err, data);
            });
        }
    });
};

Fs.prototype.save = function save(model, data, callback) {
    var db = this.connection.database(model);
    db.create(function(){
      db.post(data, function(err, result){
        callback(err, data.id);
      })
    });
    callback(null, data);
};

Fs.prototype.exists = function exists(model, id, callback) {
    callback(null, this.cache[model].hasOwnProperty(id));
};

Fs.prototype.find = function find(model, data, callback) {
  var db = this.connection.database(model);
  db.create(function(){
    if(typeof data === 'object') {
      db.find(data, callback)
    } else {
      db.get(data, callback)
    }
  });
};

Fs.prototype.destroy = function destroy(model, id, callback) {
  var db = this.connection.database(model);
  db.delete(id, callback);
};

Fs.prototype.all = function all(model, filter, callback) {
  var db = this.connection.database(model);
  db.create(function(){
    db.find(filter.where, function(err, docs){
      callback(err, docs);
    });
  });
};

function applyFilter(filter) {
    if (typeof filter.where === 'function') {
        return filter.where;
    }
    var keys = Object.keys(filter.where);
    return function (obj) {
        var pass = true;
        keys.forEach(function (key) {
            if (!test(filter.where[key], obj[key])) {
                pass = false;
            }
        });
        return pass;
    }

    function test(example, value) {
        if (typeof value === 'string' && example && example.constructor.name === 'RegExp') {
            return value.match(example);
        }
        // not strict equality
        return (example !== null ? example.toString() : example) == (value !== null ? value.toString() : value);
    }
}

Fs.prototype.destroyAll = function destroyAll(model, callback) {
    Object.keys(this.cache[model]).forEach(function (id) {
        delete this.cache[model][id];
    }.bind(this));
    this.cache[model] = {};
    callback();
};

Fs.prototype.count = function count(model, callback, where) {
    var cache = this.cache[model];
    var data = Object.keys(cache)
    if (where) {
        data = data.filter(function (id) {
            var ok = true;
            Object.keys(where).forEach(function (key) {
                if (cache[id][key] != where[key]) {
                    ok = false;
                }
            });
            return ok;
        });
    }
    callback(null, data.length);
};

Fs.prototype.updateAttributes = function updateAttributes(model, id, data, cb) {
    data.id = id;
    var base = this.cache[model][id];
    this.save(model, merge(base, data), cb);
};

function merge(base, update) {
    if (!base) return update;
    Object.keys(update).forEach(function (key) {
        base[key] = update[key];
    });
    return base;
}

