# datasource


perists resources to data storage engines



## API

#### [properties](#datasource-properties)

  - [id](#datasource-properties-id)

  - [status](#datasource-properties-status)

  - [type](#datasource-properties-type)

  - [port](#datasource-properties-port)

  - [host](#datasource-properties-host)

  - [uri](#datasource-properties-uri)

  - [username](#datasource-properties-username)

  - [password](#datasource-properties-password)


#### [methods](#datasource-methods)

  - [create](#datasource-methods-create) (options, callback)

  - [get](#datasource-methods-get) (id, callback)

  - [find](#datasource-methods-find) (options, callback)

  - [all](#datasource-methods-all) (callback)

  - [update](#datasource-methods-update) (options, callback)

  - [updateOrCreate](#datasource-methods-updateOrCreate) (options, callback)

  - [destroy](#datasource-methods-destroy) (id, callback)

  - [test](#datasource-methods-test) (datasource)



<a name="datasource-properties"></a>

## properties 
perists resources to data storage engines

- **id** 

  - **type** : any

- **status** 

  - **type** : string

  - **description** : the status of the datasource

  - **enum**

    - 0 : *online*

    - 1 : *offline*

    - 2 : *error*

  - **format** : status

  - **default** : offline

- **type** 

  - **type** : string

  - **description** : The type of the datasource

  - **enum**

    - 0 : *couch*

    - 1 : *fs*

    - 2 : *memory*

    - 3 : *mongo*

    - 4 : *mysql*

    - 5 : *redis*

  - **required** : true

  - **message** : datasource type must be valid

- **port** 

  - **type** : number

  - **description** : the port of the datasource

  - **minimum** : 1

  - **maximum** : 65535

  - **message** : port should be valid

- **host** 

  - **type** : string

  - **description** : the host of the datasource

  - **format** : host-name

  - **minLength** : 1

  - **default** : localhost

- **uri** 

  - **type** : string

  - **description** : the connection uri to the datasource

  - **default** : 

- **username** 

  - **type** : string

  - **description** : the username used to connect to the datasource

- **password** 

  - **type** : string

  - **description** : the password used to connect to the datasource

  - **format** : password



<a name="datasource-methods"></a> 

## methods 

<a name="datasource-methods-create"></a> 

### datasource.create(options, callback)

create a new datasource

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **status** 

      - **type** : string

      - **description** : the status of the datasource

      - **enum**

        - 0 : *online*

        - 1 : *offline*

        - 2 : *error*

      - **format** : status

      - **default** : offline

    - **type** 

      - **type** : string

      - **description** : The type of the datasource

      - **enum**

        - 0 : *couch*

        - 1 : *fs*

        - 2 : *memory*

        - 3 : *mongo*

        - 4 : *mysql*

        - 5 : *redis*

      - **required** : true

      - **message** : datasource type must be valid

    - **port** 

      - **type** : number

      - **description** : the port of the datasource

      - **minimum** : 1

      - **maximum** : 65535

      - **message** : port should be valid

    - **host** 

      - **type** : string

      - **description** : the host of the datasource

      - **format** : host-name

      - **minLength** : 1

      - **default** : localhost

    - **uri** 

      - **type** : string

      - **description** : the connection uri to the datasource

      - **default** : 

    - **username** 

      - **type** : string

      - **description** : the username used to connect to the datasource

    - **password** 

      - **type** : string

      - **description** : the password used to connect to the datasource

      - **format** : password

- **callback** 

  - **type** : function

<a name="datasource-methods-get"></a> 

### datasource.get(id, callback)

get datasource by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="datasource-methods-find"></a> 

### datasource.find(options, callback)

search for instances of datasource

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **status** 

      - **type** : any

      - **description** : the status of the datasource

      - **default** : 

      - **required** : false

    - **type** 

      - **type** : any

      - **description** : The type of the datasource

      - **required** : false

      - **message** : datasource type must be valid

      - **default** : 

    - **port** 

      - **type** : any

      - **description** : the port of the datasource

      - **minimum** : 1

      - **maximum** : 65535

      - **message** : port should be valid

      - **default** : 

      - **required** : false

    - **host** 

      - **type** : any

      - **description** : the host of the datasource

      - **minLength** : 1

      - **default** : 

      - **required** : false

    - **uri** 

      - **type** : any

      - **description** : the connection uri to the datasource

      - **default** : 

      - **required** : false

    - **username** 

      - **type** : any

      - **description** : the username used to connect to the datasource

      - **default** : 

      - **required** : false

    - **password** 

      - **type** : any

      - **description** : the password used to connect to the datasource

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="datasource-methods-all"></a> 

### datasource.all(callback)

gets all instances of datasource

- **callback** 

  - **type** : function

<a name="datasource-methods-update"></a> 

### datasource.update(options, callback)

updates a datasource by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **status** 

      - **type** : string

      - **description** : the status of the datasource

      - **enum**

        - 0 : *online*

        - 1 : *offline*

        - 2 : *error*

      - **format** : status

      - **default** : offline

    - **type** 

      - **type** : string

      - **description** : The type of the datasource

      - **enum**

        - 0 : *couch*

        - 1 : *fs*

        - 2 : *memory*

        - 3 : *mongo*

        - 4 : *mysql*

        - 5 : *redis*

      - **required** : true

      - **message** : datasource type must be valid

    - **port** 

      - **type** : number

      - **description** : the port of the datasource

      - **minimum** : 1

      - **maximum** : 65535

      - **message** : port should be valid

    - **host** 

      - **type** : string

      - **description** : the host of the datasource

      - **format** : host-name

      - **minLength** : 1

      - **default** : localhost

    - **uri** 

      - **type** : string

      - **description** : the connection uri to the datasource

      - **default** : 

    - **username** 

      - **type** : string

      - **description** : the username used to connect to the datasource

    - **password** 

      - **type** : string

      - **description** : the password used to connect to the datasource

      - **format** : password

- **callback** 

  - **type** : function

<a name="datasource-methods-updateOrCreate"></a> 

### datasource.updateOrCreate(options, callback)

updates a datasource by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **status** 

      - **type** : string

      - **description** : the status of the datasource

      - **enum**

        - 0 : *online*

        - 1 : *offline*

        - 2 : *error*

      - **format** : status

      - **default** : offline

    - **type** 

      - **type** : string

      - **description** : The type of the datasource

      - **enum**

        - 0 : *couch*

        - 1 : *fs*

        - 2 : *memory*

        - 3 : *mongo*

        - 4 : *mysql*

        - 5 : *redis*

      - **required** : true

      - **message** : datasource type must be valid

    - **port** 

      - **type** : number

      - **description** : the port of the datasource

      - **minimum** : 1

      - **maximum** : 65535

      - **message** : port should be valid

    - **host** 

      - **type** : string

      - **description** : the host of the datasource

      - **format** : host-name

      - **minLength** : 1

      - **default** : localhost

    - **uri** 

      - **type** : string

      - **description** : the connection uri to the datasource

      - **default** : 

    - **username** 

      - **type** : string

      - **description** : the username used to connect to the datasource

    - **password** 

      - **type** : string

      - **description** : the password used to connect to the datasource

      - **format** : password

- **callback** 

  - **type** : function

<a name="datasource-methods-destroy"></a> 

### datasource.destroy(id, callback)

destroys a datasource by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="datasource-methods-test"></a> 

### datasource.test(datasource)

tests the status of a datasource by attempting to connect to it

- **datasource** 

  - **description** : the name of the datasource to test

  - **type** : string

  - **key** : datasource

  - **required** : true





*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*