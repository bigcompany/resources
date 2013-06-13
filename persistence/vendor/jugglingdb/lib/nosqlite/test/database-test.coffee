vows = require 'vows'
assert = require 'assert'
fs = require 'fs'
path = require 'path'

nosqlite = require '../src/nosqlite'
connection = new(nosqlite.Connection) path.resolve(__dirname, 'fixtures')

vows
  .describe('database')
  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'should have "dir"': (db) ->
        assert.equal db.dir, path.resolve(__dirname, 'fixtures/test')

      'should have "name"': (db) ->
        assert.equal db.name, 'test'

      'exists()':
        topic: (db) ->
          db.exists @callback

        'should be successful': (exists) ->
          assert.isTrue exists

      'existsSync()':
        topic: (db) ->
          db.existsSync()

        'should be successful': (exists) ->
          assert.isTrue exists

      'create()':
        topic: (db) ->
          db

        'should throw error': (db) ->
          assert.throws db.create()

  .addBatch
    'Database "dummy"':
      topic: () ->
        connection.database 'dummy'

      'should have "dir"': (db) ->
        assert.equal db.dir, path.resolve(__dirname, 'fixtures/dummy')

      'should have "name"': (db) ->
        assert.equal db.name, 'dummy'

      'exists()':
        topic: (db) ->
          db.exists @callback

        'should be successful': (exists) ->
          assert.isFalse exists

      'existsSync()':
        topic: (db) ->
          db.existsSync()

        'should be successful': (exists) ->
          assert.isFalse exists

  .addBatch
    'Database "dummy"':
      topic: () ->
        connection.database 'dummy'

      'create()':
        topic: (db) ->
          db.create @callback

        'should be successful': (ex) ->
          assert.isUndefined ex
          assert.isTrue path.existsSync(path.resolve(__dirname, 'fixtures/dummy'))

  .addBatch
    'Database "dummy"':
      topic: () ->
        connection.database 'dummy'

      'destroy()':
        topic: (db) ->
          db.destroy @callback

        'should be successful': (ex) ->
          assert.isUndefined ex
          assert.isFalse path.existsSync(path.resolve(__dirname, 'fixtures/dummy'))

  .addBatch
    'Database "dummy"':
      topic: () ->
        connection.database 'dummy'

      'createSync()':
        topic: (db) ->
          db

        'should be successful': (db) ->
          assert.isUndefined db.createSync()
          assert.isTrue path.existsSync(path.resolve(__dirname, 'fixtures/dummy'))

  .addBatch
    'Database "dummy"':
      topic: () ->
        connection.database 'dummy'

      'destroySync()':
        topic: (db) ->
          db

        'should be successful': (db) ->
          assert.isUndefined db.destroySync()
          assert.isFalse path.existsSync(path.resolve(__dirname, 'fixtures/dummy'))

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'get()':
        topic: (db) ->
          db.get 'bob', @callback

        'should be successful': (err, data) ->
          assert.isNull err
          assert.equal data.id, 'bob'
          assert.equal data.name, 'bob'
          assert.equal data.age, 35

      'getSync()':
        topic: (db) ->
          db.getSync 'bob'

        'should be successful': (data) ->
          assert.equal data.id, 'bob'
          assert.equal data.name, 'bob'
          assert.equal data.age, 35

      'get() non-existing':
        topic: (db) ->
          db.get 'tim', @callback

        'should throw error': (err, data) ->
          assert.isUndefined data
          assert.equal err.code, 'ENOENT'

      'getSync() non-existing':
        topic: (db) ->
          db

        'should throw error': (db) ->
          assert.throws ->
            db.getSync 'tim'

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'post()':
        topic: (db) ->
          db.post
            id: 'tim'
            name: 'tim'
            age: 31
          , @callback

        'should be successful': (err) ->
          assert.isUndefined err

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'post() should save':
        topic: (db) ->
          db.getSync 'tim'

        'successfully': (data) ->
          assert.equal data.id, 'tim'
          assert.equal data.name, 'tim'
          assert.equal data.age, 31

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'delete()':
        topic: (db) ->
          db.delete 'tim', @callback

        'should be successful': (err) ->
          assert.isUndefined err

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'delete() should remove':
        topic: (db) ->
          db.get 'tim', @callback

        'successfully': (err, data) ->
          assert.isUndefined data
          assert.equal err.code, 'ENOENT'

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'postSync()':
        topic: (db) ->
          db

        'should be successful': (db) ->
          assert.doesNotThrow ->
            db.postSync
              id: 'tim'
              name: 'tim'
              age: 31

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'postSync() should save':
        topic: (db) ->
          db.getSync 'tim'

        'successfully': (data) ->
          assert.equal data.id, 'tim'
          assert.equal data.name, 'tim'
          assert.equal data.age, 31

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'deleteSync()':
        topic: (db) ->
          db

        'should be successful': (db) ->
          assert.doesNotThrow ->
            db.deleteSync 'tim'

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'deleteSync() should remove':
        topic: (db) ->
          db.get 'tim', @callback

        'successfully': (err, data) ->
          assert.isUndefined data
          assert.equal err.code, 'ENOENT'

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      # 'delete() non-existing':
      #   topic: (db) ->
      #     db.delete 'tim', @callback

      #   'should throw error': (err) ->
      #     assert.equal err.code, 'ENOENT'

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'deleteSync() non-existing':
        topic: (db) ->
          db

        'should throw error': (db) ->
          assert.throws ->
            db.deleteSync 'tim'

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'all()':
        topic: (db) ->
          db.all @callback

        'should be successful': (docs) ->
          assert.equal docs.length, 1
          assert.equal docs[0].id, 'bob'
          assert.equal docs[0].name, 'bob'
          assert.equal docs[0].age, 35

      'allSync()':
        topic: (db) ->
          db.allSync()

        'should be successful': (docs) ->
          assert.equal docs.length, 1
          assert.equal docs[0].id, 'bob'
          assert.equal docs[0].name, 'bob'
          assert.equal docs[0].age, 35

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'find()':
        topic: (db) ->
          db.find age: 35, @callback

        'should be successful': (docs) ->
          assert.equal docs.length, 1
          assert.equal docs[0].id, 'bob'
          assert.equal docs[0].name, 'bob'
          assert.equal docs[0].age, 35

      'findSync()':
        topic: (db) ->
          db.findSync age: 35

        'should be successful': (docs) ->
          assert.equal docs.length, 1
          assert.equal docs[0].id, 'bob'
          assert.equal docs[0].name, 'bob'
          assert.equal docs[0].age, 35

      'find() empty':
        topic: (db) ->
          db.find age: 31, @callback

        'should be successful': (docs) ->
          assert.equal docs.length, 0

      'findSync() empty':
        topic: (db) ->
          db.findSync age: 31

        'should be successful': (docs) ->
          assert.equal docs.length, 0

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'put()':
        topic: (db) ->
          db.put 'bob', age: 31, @callback

        'should be successful': (err) ->
          assert.isUndefined err

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'should be saved':
        topic: (db) ->
          db.getSync 'bob'

        'successfully': (data) ->
          assert.equal data.age, 31

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'putSync()':
        topic: (db) ->
          db

        'should be successful': (db) ->
          assert.doesNotThrow ->
            db.putSync 'bob', age: 35

  .addBatch
    'Database "test"':
      topic: () ->
        connection.database 'test'

      'should be saved':
        topic: (db) ->
          db.getSync 'bob'

        'successfully': (data) ->
          assert.equal data.age, 35

  .export(module)
