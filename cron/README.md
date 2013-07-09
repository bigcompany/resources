# cron


for managing cron jobs



## API

#### [properties](#cron-properties)

  - [id](#cron-properties-id)

  - [pattern](#cron-properties-pattern)

  - [event](#cron-properties-event)

  - [with](#cron-properties-with)


#### [methods](#cron-methods)

  - [create](#cron-methods-create) (options, callback)

  - [get](#cron-methods-get) (id, callback)

  - [find](#cron-methods-find) (options, callback)

  - [all](#cron-methods-all) (callback)

  - [update](#cron-methods-update) (options, callback)

  - [updateOrCreate](#cron-methods-updateOrCreate) (options, callback)

  - [destroy](#cron-methods-destroy) (id, callback)

  - [run](#cron-methods-run) ()

  - [start](#cron-methods-start) ()



<a name="cron-properties"></a>

## properties 
for managing cron jobs

- **id** 

  - **type** : any

- **pattern** 

  - **type** : string

  - **default** : */5 * * * * *

  - **description** : the pattern of the cron job

- **event** 

  - **type** : string

  - **default** : logger::log

  - **description** : the event to be emitted each time the cron runs

- **with** 

  - **type** : object

  - **description** : metadata to execute the cron with



<a name="cron-methods"></a> 

## methods 

<a name="cron-methods-create"></a> 

### cron.create(options, callback)

create a new cron

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **pattern** 

      - **type** : string

      - **default** : */5 * * * * *

      - **description** : the pattern of the cron job

    - **event** 

      - **type** : string

      - **default** : logger::log

      - **description** : the event to be emitted each time the cron runs

    - **with** 

      - **type** : object

      - **description** : metadata to execute the cron with

- **callback** 

  - **type** : function

<a name="cron-methods-get"></a> 

### cron.get(id, callback)

get cron by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="cron-methods-find"></a> 

### cron.find(options, callback)

search for instances of cron

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **pattern** 

      - **type** : any

      - **default** : 

      - **description** : the pattern of the cron job

      - **required** : false

    - **event** 

      - **type** : any

      - **default** : 

      - **description** : the event to be emitted each time the cron runs

      - **required** : false

    - **with** 

      - **type** : any

      - **description** : metadata to execute the cron with

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="cron-methods-all"></a> 

### cron.all(callback)

gets all instances of cron

- **callback** 

  - **type** : function

<a name="cron-methods-update"></a> 

### cron.update(options, callback)

updates a cron by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **pattern** 

      - **type** : string

      - **default** : */5 * * * * *

      - **description** : the pattern of the cron job

    - **event** 

      - **type** : string

      - **default** : logger::log

      - **description** : the event to be emitted each time the cron runs

    - **with** 

      - **type** : object

      - **description** : metadata to execute the cron with

- **callback** 

  - **type** : function

<a name="cron-methods-updateOrCreate"></a> 

### cron.updateOrCreate(options, callback)

updates a cron by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **pattern** 

      - **type** : string

      - **default** : */5 * * * * *

      - **description** : the pattern of the cron job

    - **event** 

      - **type** : string

      - **default** : logger::log

      - **description** : the event to be emitted each time the cron runs

    - **with** 

      - **type** : object

      - **description** : metadata to execute the cron with

- **callback** 

  - **type** : function

<a name="cron-methods-destroy"></a> 

### cron.destroy(id, callback)

destroys a cron by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="cron-methods-run"></a> 

### cron.run()

runs / starts a cron job

<a name="cron-methods-start"></a> 

### cron.start()

starts the cron resource ( which will run all cron jobs )



## dependencies 
- [cron](http://npmjs.org/package/cron) v1.0.1


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*