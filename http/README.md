# http

provides an HTTP server API

## API

#### [properties](#http-properties)

  - [id](#http-properties-id)

  - [port](#http-properties-port)

  - [host](#http-properties-host)

  - [root](#http-properties-root)


#### [methods](#http-methods)

  - [listen](#http-methods-listen) (options, callback)


<a name="http-properties"></a>

## properties 
provides an HTTP server API

- **id** 

  - **type** : any

- **port** 

  - **type** : number

  - **default** : 8888

  - **description** : the port to listen on 

- **host** 

  - **type** : string

  - **default** : 0.0.0.0

  - **description** : the host interface to listen on

- **root** 

  - **type** : string

  - **default** : /Users/maraksquires/dev/bigcompany/resources/http/public


<a name="http-methods"></a> 

## methods 

<a name="http-methods-listen"></a> 

### http.listen(options, callback)

starts a listening http server

- **options** 

  - **type** : object

  - **properties**

    - **port** 

      - **type** : number

      - **default** : 8888

      - **description** : the port to listen on 

    - **host** 

      - **type** : string

      - **default** : 0.0.0.0

      - **description** : the host interface to listen on

    - **root** 

      - **type** : string

      - **default** : /Users/maraksquires/dev/bigcompany/resources/http/public

    - **enableUploads** 

      - **type** : boolean

      - **default** : true

- **callback** 

  - **description** : the callback executed after server listen

  - **type** : function

  - **required** : false


## dependencies 
- [connect](http://npmjs.org/package/connect)
- [express](http://npmjs.org/package/express)

*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*