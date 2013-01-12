# cron

for managing cron jobs

## API

#### [properties](#cron-properties)

  - [id](#cron-properties-id)

  - [pattern](#cron-properties-pattern)

  - [event](#cron-properties-event)

  - [with](#cron-properties-with)


#### [methods](#cron-methods)

  - [run](#cron-methods-run) ()

  - [create](#cron-methods-create) ()

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

<a name="cron-methods-run"></a> 

### cron.run()

<a name="cron-methods-create"></a> 

### cron.create()

<a name="cron-methods-start"></a> 

### cron.start()


## dependencies 
- [cron](http://npmjs.org/package/cron) v1.0.1

*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*