# nosqlite [![Build Status](https://secure.travis-ci.org/pksunkara/nosqlite.png)](http://travis-ci.org/pksunkara/nosqlite)

nosqlite is human readable nosql type filesystem json store

## Installation
```
npm install nosqlite
```

## Usage

### Create a connection

```js
// Default path for store
connection = new(require('nosqlite').Connection)();

// Custom path for store
connection = new(require('nosqlite').Connection)('/path/to/store');
```

### Select a database

```js
// Default db is 'test'
db = connection.database('dummy');
```

### Check if database exists

```js
// Async
db.exists(function (exists) {
  if (!exists) console.log('Need to create it');
});

// Sync
if (!db.existsSync()) console.log('Need to create it');
```

### Create a database

```js
// Async
db.create(function (err) {
  if (err) throw err;
});

//Sync
db.createSync();
```

### Destroy a database

```js
// Async
db.destroy(function (err) {
  if (err) throw err;
});

//Sync
db.destroySync();
```

### Create a document

```js
// Async
db.post(obj, function (err) {
  if (err) throw err;
});

// Sync
db.postSync(obj);
```

### Get a document

```js
// Async
db.get('bob', function(err, obj) {
  if (err) throw err;
  console.log(obj);
});

// Sync
db.getSync('bob');
```

### Update a document

```js
// Async
db.put('bob', {age: 35}, function (err) {
  if (err) throw err;
});

// Sync
db.putSync('bob', {age: 35});
```

### Delete a document

```js
// Async
db.delete('bob', function (err) {
  if (err) throw err;
});

// Sync
db.deleteSync('bob');
```

### Find a document

```js
// Async
db.find({hair: 'black'}, function (err, docs) {
  if (err) throw err;
});

// Sync
docs = db.findSync({hair: 'black'});
```

### All documents

```js
// Async
db.all(function (err, docs) {
  if (err) throw err;
});

// Sync
docs = db.allSync();
```

If you like this project, please watch this and follow me.

## Testing
```
npm test
```

## Contributors
Here is a list of [Contributors](http://github.com/pksunkara/nosqlite/contributors)

### TODO

- Authentication system
- Map-Reduce (views)
- Auto ID generation
- Buffer writes internally
- Concurrent writes from multi processes

__I accept pull requests and guarantee a reply back within a day__

## License
MIT/X11

## Bug Reports
Report [here](http://github.com/pksunkara/nosqlite/issues). __Guaranteed reply within a day__.

## Contact
Pavan Kumar Sunkara (pavan.sss1991@gmail.com)

Follow me on [github](https://github.com/users/follow?target=pksunkara), [twitter](http://twitter.com/pksunkara)
