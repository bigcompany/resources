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

    - 0 : *inactive*

    - 1 : *active*

    - 2 : *error*

  - **format** : status

  - **default** : inactive

- **type** 

  - **type** : string

  - **description** : The type of the datasource

  - **enum**

    - 0 : *couch*

    - 1 : *file-system*

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


<a name="datasource-methods"></a> 

## methods 

<a name="datasource-methods-test"></a> 

### datasource.test(datasource)

tests the datasource connection

- **datasource** 

  - **description** : the name of the datasource to test

  - **type** : string


{}
*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*