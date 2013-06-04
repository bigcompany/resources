# config

configuration management for resources

## API

#### [properties](#config-properties)

  - [id](#config-properties-id)


#### [methods](#config-methods)

  - [create](#config-methods-create) (options, callback)

  - [get](#config-methods-get) (id, callback)

  - [find](#config-methods-find) (options, callback)

  - [all](#config-methods-all) (callback)

  - [update](#config-methods-update) (options, callback)

  - [updateOrCreate](#config-methods-updateOrCreate) (options, callback)

  - [destroy](#config-methods-destroy) (id, callback)

  - [start](#config-methods-start) (id, callback)

  - [attach](#config-methods-attach) (options, callback)


configuration management for resources

- **id** 

  - **type** : any


<a name="config-methods"></a> 

## methods 

<a name="config-methods-create"></a> 

### config.create(options, callback)

create a new config

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

- **callback** 

  - **type** : function

<a name="config-methods-get"></a> 

### config.get(id, callback)

get config by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="config-methods-find"></a> 

### config.find(options, callback)

search for instances of config

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="config-methods-all"></a> 

### config.all(callback)

gets all instances of config

- **callback** 

  - **type** : function

<a name="config-methods-update"></a> 

### config.update(options, callback)

updates a config by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

- **callback** 

  - **type** : function

<a name="config-methods-updateOrCreate"></a> 

### config.updateOrCreate(options, callback)

updates a config by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

- **callback** 

  - **type** : function

<a name="config-methods-destroy"></a> 

### config.destroy(id, callback)

destroys a config by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="config-methods-start"></a> 

### config.start(id, callback)

load configuration options

- **id** 

  - **type** : any

- **callback** 

  - **type** : function

<a name="config-methods-attach"></a> 

### config.attach(options, callback)

Attach configuration options to the config resource

- **options** 

  - **type** : object

- **callback** 

  - **type** : function



*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*