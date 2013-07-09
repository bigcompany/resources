# replicator


provides an application replication API for resource based apps



## API

#### [properties](#replicator-properties)

  - [id](#replicator-properties-id)


#### [methods](#replicator-methods)

  - [push](#replicator-methods-push) (options, callback)

  - [pull](#replicator-methods-pull) (options, callback)

  - [checkout](#replicator-methods-checkout) (options, callback)

  - [listen](#replicator-methods-listen) (callback)

  - [start](#replicator-methods-start) (callback)



provides an application replication API for resource based apps

- **id** 

  - **type** : any



<a name="replicator-methods"></a> 

## methods 

<a name="replicator-methods-push"></a> 

### replicator.push(options, callback)

pushes local big instance to a remote big instance

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the host to push to

      - **type** : string

      - **default** : biginternetcompany.net

    - **port** 

      - **description** : the port to push to

      - **type** : string

      - **default** : 8888

- **callback** 

  - **type** : function

<a name="replicator-methods-pull"></a> 

### replicator.pull(options, callback)

pulls a big instance from a remote big instance

- **options** 

  - **type** : object

- **callback** 

  - **type** : function

<a name="replicator-methods-checkout"></a> 

### replicator.checkout(options, callback)

checks out a local git repo into a directory

- **options** 

  - **type** : object

  - **properties**

    - **repo** 

      - **description** : the repo to checkout

      - **type** : string

    - **path** 

      - **description** : the path to check the repo out to

      - **type** : string

- **callback** 

  - **type** : function

<a name="replicator-methods-listen"></a> 

### replicator.listen(callback)

starts a listening replicator service capable of recieving push requests

- **callback** 

  - **type** : function

<a name="replicator-methods-start"></a> 

### replicator.start(callback)

starts a listening replicator service capable of recieving push requests

- **callback** 

  - **type** : function



## dependencies 
- [pushover](http://npmjs.org/package/pushover) v1.1.0


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*