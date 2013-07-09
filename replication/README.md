# replication


for managing and keeping track of replication events



## API

#### [properties](#replication-properties)

  - [id](#replication-properties-id)

  - [time](#replication-properties-time)

  - [source](#replication-properties-source)

  - [target](#replication-properties-target)

  - [repo](#replication-properties-repo)

  - [branch](#replication-properties-branch)


#### [methods](#replication-methods)

  - [create](#replication-methods-create) (options, callback)

  - [get](#replication-methods-get) (id, callback)

  - [find](#replication-methods-find) (options, callback)

  - [all](#replication-methods-all) (callback)

  - [update](#replication-methods-update) (options, callback)

  - [updateOrCreate](#replication-methods-updateOrCreate) (options, callback)

  - [destroy](#replication-methods-destroy) (id, callback)



<a name="replication-properties"></a>

## properties 
for managing and keeping track of replication events

- **id** 

  - **type** : any

- **time** 

  - **description** : the date and time of the replication

  - **type** : string

  - **default** : Tue Jul 09 2013 02:04:18 GMT-0700 (PDT)

- **source** 

  - **description** : the source of the replication ( where the code is coming from )

  - **type** : string

- **target** 

  - **description** : the target of the replication ( where the code is going )

  - **type** : string

- **repo** 

  - **type** : string

- **branch** 

  - **type** : string



<a name="replication-methods"></a> 

## methods 

<a name="replication-methods-create"></a> 

### replication.create(options, callback)

create a new replication

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **time** 

      - **description** : the date and time of the replication

      - **type** : string

      - **default** : Tue Jul 09 2013 02:04:18 GMT-0700 (PDT)

    - **source** 

      - **description** : the source of the replication ( where the code is coming from )

      - **type** : string

    - **target** 

      - **description** : the target of the replication ( where the code is going )

      - **type** : string

    - **repo** 

      - **type** : string

    - **branch** 

      - **type** : string

- **callback** 

  - **type** : function

<a name="replication-methods-get"></a> 

### replication.get(id, callback)

get replication by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="replication-methods-find"></a> 

### replication.find(options, callback)

search for instances of replication

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **time** 

      - **description** : the date and time of the replication

      - **type** : any

      - **default** : 

      - **required** : false

    - **source** 

      - **description** : the source of the replication ( where the code is coming from )

      - **type** : any

      - **default** : 

      - **required** : false

    - **target** 

      - **description** : the target of the replication ( where the code is going )

      - **type** : any

      - **default** : 

      - **required** : false

    - **repo** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **branch** 

      - **type** : any

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="replication-methods-all"></a> 

### replication.all(callback)

gets all instances of replication

- **callback** 

  - **type** : function

<a name="replication-methods-update"></a> 

### replication.update(options, callback)

updates a replication by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **time** 

      - **description** : the date and time of the replication

      - **type** : string

      - **default** : Tue Jul 09 2013 02:04:18 GMT-0700 (PDT)

    - **source** 

      - **description** : the source of the replication ( where the code is coming from )

      - **type** : string

    - **target** 

      - **description** : the target of the replication ( where the code is going )

      - **type** : string

    - **repo** 

      - **type** : string

    - **branch** 

      - **type** : string

- **callback** 

  - **type** : function

<a name="replication-methods-updateOrCreate"></a> 

### replication.updateOrCreate(options, callback)

updates a replication by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **time** 

      - **description** : the date and time of the replication

      - **type** : string

      - **default** : Tue Jul 09 2013 02:04:18 GMT-0700 (PDT)

    - **source** 

      - **description** : the source of the replication ( where the code is coming from )

      - **type** : string

    - **target** 

      - **description** : the target of the replication ( where the code is going )

      - **type** : string

    - **repo** 

      - **type** : string

    - **branch** 

      - **type** : string

- **callback** 

  - **type** : function

<a name="replication-methods-destroy"></a> 

### replication.destroy(id, callback)

destroys a replication by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function





*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*