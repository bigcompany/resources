#
# nosqlite.coffee - top level file
#
# Copyright © 2011 Pavan Kumar Sunkara. All rights reserved
#

nosqlite = module.exports

# Requiring modules
path = require 'path'
fs = require 'fs'
rimraf = require '../vendor/rimraf'
async = require 'async'

# Declaring variables
nosqlite.path = path.join __dirname, '..', 'data'

# Connection class for nosqlite
nosqlite.Connection = (arg) ->
  options = {}
  @path = nosqlite.path

  if typeof(arg) is 'object'
    options = arg
    @path = options.path
  else if typeof(arg) is 'string'
    @path = arg

# Database class which we work with
nosqlite.Connection::database = (name, mode) ->
  that = this

  # Variables
  dir: path.resolve that.path, name
  name: name || 'test'
  mode: mode || '0775'

  # Utils
  file: (id) ->
    path.resolve @dir, id + '.json'

  project: (onto, from) ->
    Object.keys(from).forEach (k) ->
      onto[k] = from[k]
    onto

  satisfy: (data, cond) ->
    Object.keys(cond).every (k) ->
      if data[k] is cond[k] then true else false

  # Write files tmp and rename
  _write: (id, data, cb) ->
    fs.writeFile @file('.' + id), data, (err) =>
      if err then cb err else fs.rename @file('.' + id), @file(id), cb

  _writeSync: (id, data) ->
    fs.writeFileSync @file('.' + id), data
    fs.renameSync @file('.' + id), @file(id)

  # Check if db exists
  exists: (cb) ->
    path.exists @dir, cb

  existsSync: ->
    path.existsSync @dir

  # Create db
  create: (cb) ->
    fs.mkdir @dir, @mode, cb

  createSync: ->
    fs.mkdirSync @dir, @mode

  # Destroy db
  destroy: (cb) ->
    rimraf @dir, cb

  destroySync: ->
    rimraf.sync @dir

  # Get doc by id
  get: (id, cb) ->
    fs.readFile @file(id), 'utf8', (err, data) ->
      cb err, (JSON.parse(data) if data)

  getSync: (id) ->
    JSON.parse fs.readFileSync @file(id), 'utf8'

  # Remove doc by id
  delete: (id, cb) ->
    fs.unlink @file(id), cb

  deleteSync: (id) ->
    fs.unlinkSync @file(id)

  # Update doc by id
  put: (id, obj, cb) ->
    @get id, (err, data) =>
      data = @project data, obj
      @_write id, JSON.stringify(data, null, 2), cb

  putSync: (id, obj) ->
    data = @project @getSync(id), obj
    @_writeSync id, JSON.stringify(data, null, 2)

  # Create doc
  post: (obj, cb) ->
    @_write obj.id or obj._id, JSON.stringify(obj, null, 2), cb

  postSync: (obj) ->
    @_writeSync obj.id or obj._id, JSON.stringify(obj, null, 2)

  # Find a doc
  find: (cond, cb) ->
    fs.readdir @dir, (err, files) =>
      async.map files, (file, callback) =>
        @get path.basename(file, '.json'), (err, data) =>
          if @satisfy data, cond then callback err, data else callback err, null
      , (err, files) ->
        cb err, files.filter (file) -> file?

  findSync: (cond) ->
    files = fs.readdirSync @dir
    files = files.map (file) =>
      data = @getSync path.basename(file, '.json')
      if @satisfy data, cond then data else null
    files.filter (file) -> file?

  # Get all docs
  all: (cb) ->
    fs.readdir @dir, (err, files) =>
      async.map files, (file, callback) =>
        @get path.basename(file, '.json'), callback
      , cb

  allSync: ->
    files = fs.readdirSync @dir
    files.map (file) =>
      @getSync path.basename file, '.json'
