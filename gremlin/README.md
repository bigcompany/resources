# gremlin


provides gremlin graph traversal as a big resource. 



## API

#### [properties](#gremlin-properties)

  - [id](#gremlin-properties-id)

  - [javacom](#gremlin-properties-javacom)

  - [database](#gremlin-properties-database)

  - [username](#gremlin-properties-username)

  - [password](#gremlin-properties-password)


#### [methods](#gremlin-methods)

  - [connect](#gremlin-methods-connect) (options, callback)

  - [commit](#gremlin-methods-commit) ()

  - [disconnect](#gremlin-methods-disconnect) ()



<a name="gremlin-properties"></a>

## properties 
provides gremlin graph traversal as a big resource. 

- **id** 

  - **type** : any

- **javacom** 

  - **type** : string

  - **default** : com.tinkerpop.blueprints.impls.orient.OrientGraph

  - **description** : the java com required to connect to your graphdb.

- **database** 

  - **type** : string

  - **default** : remote:localhost:2424/test

  - **description** : the location of your database, can be remote or local.

- **username** 

  - **type** : string

  - **default** : admin

  - **description** : the username for your database.

- **password** 

  - **type** : string

  - **default** : admin

  - **description** : the password for your database.



<a name="gremlin-methods"></a> 

## methods 

<a name="gremlin-methods-connect"></a> 

### gremlin.connect(options, callback)

connects to your database and opens a connection.

- **options** 

  - **properties**

    - **javacom** 

      - **type** : string

      - **default** : com.tinkerpop.blueprints.impls.orient.OrientGraph

      - **description** : the java com required to connect to your graphdb.

    - **database** 

      - **type** : string

      - **default** : remote:localhost:2424/test

      - **description** : the location of your database, can be remote or local.

    - **username** 

      - **type** : string

      - **default** : admin

      - **description** : the username for your database.

    - **password** 

      - **type** : string

      - **default** : admin

      - **description** : the password for your database.

- **callback** 

  - **description** : the callback executed after database connect

  - **type** : function

  - **required** : false

<a name="gremlin-methods-commit"></a> 

### gremlin.commit()

saves changes to the database.

<a name="gremlin-methods-disconnect"></a> 

### gremlin.disconnect()

disconnects from database.



## dependencies 
- [gremlin](http://npmjs.org/package/gremlin) v0.1.x


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*