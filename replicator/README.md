# replicator

replicator service for big instances

## API

#### [properties](#replicator-properties)

  - [id](#replicator-properties-id)


#### [methods](#replicator-methods)

  - [push](#replicator-methods-push) (options, callback)

  - [pull](#replicator-methods-pull) (options, callback)

  - [log](#replicator-methods-log) ()

  - [checkout](#replicator-methods-checkout) (options, callback)

  - [listen](#replicator-methods-listen) (callback)


replicator service for big instances

- **id** 

  - **type** : any


<a name="replicator-methods"></a> 

## methods 

<a name="replicator-methods-push"></a> 

### replicator.push(options, callback)

pushes current big instance to a remote big instance

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

  - **properties**

    - **path** 

      - **description** : the path to pull the big instance from

      - **type** : string

    - **location** 

      - **description** : the type of location big is pulling from

      - **type** : string

      - **enum**

        - 0 : *fs*

        - 1 : *http*

    - **targetDir** 

      - **description** : the location to extract big instance

      - **type** : string

- **callback** 

  - **type** : function

<a name="replicator-methods-log"></a> 

### replicator.log()

<a name="replicator-methods-checkout"></a> 

### replicator.checkout(options, callback)

checks out a local git repo into a directory

- **options** 

  - **repo**

    - description : *the repo to checkout*

    - type : *string*

  - **path**

    - description : *the path to check the repo out to*

    - type : *string*

- **callback** 

  - **type** : function

<a name="replicator-methods-listen"></a> 

### replicator.listen(callback)

starts a listening replicator service capable of recieving big push requests

- **callback** 

  - **type** : function


{"pushover":"*"}
*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*