# replicator

replicator service for big instances

## API

#### [properties](#replicator-properties)

  - [id](#replicator-properties-id)

  - [replication](#replicator-properties-replication)


#### [methods](#replicator-methods)

  - [push](#replicator-methods-push) (options, callback)

  - [pull](#replicator-methods-pull) (options, callback)

  - [listen](#replicator-methods-listen) ()


<a name="replicator-properties"></a>

## properties 
replicator service for big instances

- **id** 

  - **type** : any

- **replication** 

  - **decription** : a replication event

  - **properties**

    - **time** 

      - **description** : the date and time of the replication

      - **type** : string

      - **default** : Thu Oct 04 2012 16:25:00 GMT-0700 (PDT)

    - **source** 

      - **description** : the source of the replication ( where the code is coming from )

      - **type** : string

    - **target** 

      - **description** : the target of the replication ( where the code is going )

      - **type** : string


<a name="replicator-methods"></a> 

## methods 

<a name="replicator-methods-push"></a> 

### replicator.push(options, callback)

pushes current big instance to a remote big instance

- **options** 

  - **type** : object

  - **properties**

    - **path** 

      - **description** : the path of the big instance to push

      - **type** : string

      - **default** : .

    - **location** 

      - **description** : the location to push the big instance

      - **type** : string

      - **default** : localhost

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

<a name="replicator-methods-listen"></a> 

### replicator.listen()


{"fstream":"*","fstream-npm":"*","tar":"*","request":"*","ncp":"*"}
*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*