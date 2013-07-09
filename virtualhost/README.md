# virtualhost


provides virtual hosts



## API

#### [properties](#virtualhost-properties)

  - [id](#virtualhost-properties-id)

  - [host](#virtualhost-properties-host)

  - [path](#virtualhost-properties-path)


#### [methods](#virtualhost-methods)

  - [create](#virtualhost-methods-create) (options, callback)

  - [get](#virtualhost-methods-get) (id, callback)

  - [find](#virtualhost-methods-find) (options, callback)

  - [all](#virtualhost-methods-all) (callback)

  - [update](#virtualhost-methods-update) (options, callback)

  - [updateOrCreate](#virtualhost-methods-updateOrCreate) (options, callback)

  - [destroy](#virtualhost-methods-destroy) (id, callback)



<a name="virtualhost-properties"></a>

## properties 
provides virtual hosts

- **id** 

  - **type** : any

- **host** 

  - **type** : string

- **path** 

  - **type** : string



<a name="virtualhost-methods"></a> 

## methods 

<a name="virtualhost-methods-create"></a> 

### virtualhost.create(options, callback)

create a new virtualhost

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **host** 

      - **type** : string

    - **path** 

      - **type** : string

- **callback** 

  - **type** : function

<a name="virtualhost-methods-get"></a> 

### virtualhost.get(id, callback)

get virtualhost by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="virtualhost-methods-find"></a> 

### virtualhost.find(options, callback)

search for instances of virtualhost

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **host** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **path** 

      - **type** : any

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="virtualhost-methods-all"></a> 

### virtualhost.all(callback)

gets all instances of virtualhost

- **callback** 

  - **type** : function

<a name="virtualhost-methods-update"></a> 

### virtualhost.update(options, callback)

updates a virtualhost by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **host** 

      - **type** : string

    - **path** 

      - **type** : string

- **callback** 

  - **type** : function

<a name="virtualhost-methods-updateOrCreate"></a> 

### virtualhost.updateOrCreate(options, callback)

updates a virtualhost by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **host** 

      - **type** : string

    - **path** 

      - **type** : string

- **callback** 

  - **type** : function

<a name="virtualhost-methods-destroy"></a> 

### virtualhost.destroy(id, callback)

destroys a virtualhost by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function



## dependencies 
- [connect](http://npmjs.org/package/connect) v2.7.1


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*