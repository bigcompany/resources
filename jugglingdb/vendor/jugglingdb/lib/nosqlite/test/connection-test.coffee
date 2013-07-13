vows = require 'vows'
assert = require 'assert'
path = require 'path'

vows
  .describe('connection')
  .addBatch
    'Connection':
      topic: require '../src/nosqlite'

      'should have default path': (nosqlite) ->
        assert.equal nosqlite.path, path.resolve(__dirname, '..', 'data')

      'without options':
        topic: (nosqlite) ->
          return new(nosqlite.Connection)()

        'should be successful': (topic) ->
          assert.equal topic.path, path.resolve(__dirname, '..', 'data')

      'with options':
        topic: (nosqlite) ->
          return new(nosqlite.Connection) path.resolve(__dirname, 'fixtures')

        'should be successful': (topic) ->
          assert.equal topic.path, path.resolve(__dirname, 'fixtures')

  .export(module)
