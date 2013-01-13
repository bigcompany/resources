# oauth

for managing oauth logins and tokens

## API

#### [properties](#oauth-properties)

  - [id](#oauth-properties-id)

  - [service](#oauth-properties-service)

  - [requestUrl](#oauth-properties-requestUrl)

  - [accessUrl](#oauth-properties-accessUrl)

  - [consumerKey](#oauth-properties-consumerKey)

  - [consumerSecret](#oauth-properties-consumerSecret)

  - [version](#oauth-properties-version)

  - [authorize_callback](#oauth-properties-authorize_callback)

  - [signatureMethod](#oauth-properties-signatureMethod)


#### [methods](#oauth-methods)

  - [start](#oauth-methods-start) (options, callback)

  - [authorize](#oauth-methods-authorize) (options, callback)


<a name="oauth-properties"></a>

## properties 
for managing oauth logins and tokens

- **id** 

  - **type** : any

- **service** 

  - **description** : the name of the service associated with this oauth token

  - **type** : string

- **requestUrl** 

  - **description** : the requested service url

  - **type** : string

- **accessUrl** 

  - **description** : the access url for said service

  - **type** : string

- **consumerKey** 

  - **type** : string

- **consumerSecret** 

  - **type** : string

- **version** 

  - **type** : string

- **authorize_callback** 

  - **description** : url to be sent back to on authorization

  - **type** : string

- **signatureMethod** 

  - **type** : string

  - **default** : HMAC-SHA1


<a name="oauth-methods"></a> 

## methods 

<a name="oauth-methods-start"></a> 

### oauth.start(options, callback)

create an oauth object for authentication and requesting purposes

- **options** 

  - **id**

    - type : *any*

  - **service**

    - description : *the name of the service associated with this oauth token*

    - type : *string*

  - **requestUrl**

    - description : *the requested service url*

    - type : *string*

  - **accessUrl**

    - description : *the access url for said service*

    - type : *string*

  - **consumerKey**

    - type : *string*

  - **consumerSecret**

    - type : *string*

  - **version**

    - type : *string*

  - **authorize_callback**

    - description : *url to be sent back to on authorization*

    - type : *string*

  - **signatureMethod**

    - type : *string*

    - default : *HMAC-SHA1*

- **callback** 

  - **required** : false

  - **default** : function () {}

<a name="oauth-methods-authorize"></a> 

### oauth.authorize(options, callback)

authorize by oauth

- **options** 

  - **id**

    - type : *any*

  - **service**

    - description : *the name of the service associated with this oauth token*

    - type : *string*

  - **requestUrl**

    - description : *the requested service url*

    - type : *string*

  - **accessUrl**

    - description : *the access url for said service*

    - type : *string*

  - **consumerKey**

    - type : *string*

  - **consumerSecret**

    - type : *string*

  - **version**

    - type : *string*

  - **authorize_callback**

    - description : *url to be sent back to on authorization*

    - type : *string*

  - **signatureMethod**

    - type : *string*

    - default : *HMAC-SHA1*

- **callback** 

  - **required** : false

  - **default** : function () {}


## dependencies 
- [node-oauth](http://npmjs.org/package/node-oauth)

*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*