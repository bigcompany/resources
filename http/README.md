# http


provides an HTTP API



## API

#### [properties](#http-properties)

  - [id](#http-properties-id)

  - [port](#http-properties-port)

  - [host](#http-properties-host)

  - [root](#http-properties-root)


#### [methods](#http-methods)

  - [listen](#http-methods-listen) (options, callback)

  - [start](#http-methods-start) (options, callback)

  - [request](#http-methods-request) (options)



<a name="http-properties"></a>

## properties 
provides an HTTP API

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

  - **default** : /Users/macbookpro/dev/big/big/public



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

      - **default** : /Users/macbookpro/dev/big/big/public

    - **enableUploads** 

      - **type** : boolean

      - **default** : true

- **callback** 

  - **description** : the callback executed after server listen

  - **type** : function

  - **required** : false

<a name="http-methods-start"></a> 

### http.start(options, callback)

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

      - **default** : /Users/macbookpro/dev/big/big/public

    - **enableUploads** 

      - **type** : boolean

      - **default** : true

- **callback** 

  - **description** : the callback executed after server listen

  - **type** : function

  - **required** : false

<a name="http-methods-request"></a> 

### http.request(options)

makes outgoing http client requests

- **options** 

  - **type** : object

  - **properties**

    - **uri** 

      - **description** : the uri to be requested

      - **type** : string

      - **required** : true

    - **qs** 

      - **description** : querystring values appended to the uri

      - **type** : object

      - **required** : false

    - **method** 

      - **description** : the HTTP method to use

      - **type** : string

      - **enum**

        - 0 : *GET*

        - 1 : *HEAD*

        - 2 : *POST*

        - 3 : *PUT*

        - 4 : *DELETE*

        - 5 : *TRACE*

        - 6 : *OPTIONS*

        - 7 : *CONNECT*

        - 8 : *PATCH*

    - **headers** 

      - **description** : the http headers for the request

      - **type** : object

      - **required** : false

    - **body** 

      - **description** : the raw body for POST and PUT requests

      - **required** : false

    - **form** 

      - **description** : form data in the request body

      - **type** : object

      - **required** : false

    - **json** 

      - **description** : JSON data in the request body

      - **type** : any

      - **required** : false

    - **multipart** 

      - **description** : data in a multi-part request

      - **type** : array

      - **required** : false

    - **maxRedirects** 

      - **description** : maximum number of redirects to follow

      - **type** : number

      - **required** : false

      - **default** : 10

    - **encoding** 

      - **description** : set the text encoding of the request body

      - **type** : string

      - **required** : false

    - **timeout** 

      - **description** : how long to wait (in ms) before the request times out

      - **type** : number

      - **required** : false



## dependencies 
- [connect](http://npmjs.org/package/connect) v2.7.1
- [express](http://npmjs.org/package/express) v3.0.4
- [request](http://npmjs.org/package/request) v2.12.0


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*