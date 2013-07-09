# oauth


for managing oauth providers and sessions



## API

#### [properties](#oauth-properties)

  - [id](#oauth-properties-id)

  - [credentials](#oauth-properties-credentials)


#### [methods](#oauth-methods)

  - [consumer](#oauth-methods-consumer) (options)

  - [create](#oauth-methods-create) ()

  - [requestToken](#oauth-methods-requestToken) (options, callback)

  - [accessToken](#oauth-methods-accessToken) (options, callback)



<a name="oauth-properties"></a>

## properties 
for managing oauth providers and sessions

- **id** 

  - **type** : any

- **credentials** 

  - **description** : credentials for an oauth endpoint

  - **properties**

    - **requestUrl** 

      - **description** : the requested service url

      - **type** : string

      - **required** : true

    - **accessUrl** 

      - **description** : the access url for said service

      - **type** : string

      - **required** : true

    - **consumerKey** 

      - **type** : string

      - **required** : true

    - **consumerSecret** 

      - **type** : string

      - **required** : true

    - **version** 

      - **type** : string

      - **required** : true

    - **authorize_callback** 

      - **description** : url to be sent back to on authorization

      - **type** : string

      - **required** : true

    - **signatureMethod** 

      - **type** : string

      - **required** : true



<a name="oauth-methods"></a> 

## methods 

<a name="oauth-methods-consumer"></a> 

### oauth.consumer(options)

creates oauth consumer

- **options** 

  - **type** : object

  - **required** : true

  - **properties**

    - **requestUrl** 

      - **description** : the requested service url

      - **type** : string

      - **required** : true

    - **accessUrl** 

      - **description** : the access url for said service

      - **type** : string

      - **required** : true

    - **consumerKey** 

      - **type** : string

      - **required** : true

    - **consumerSecret** 

      - **type** : string

      - **required** : true

    - **version** 

      - **type** : string

      - **required** : true

    - **authorize_callback** 

      - **description** : url to be sent back to on authorization

      - **type** : string

      - **required** : true

    - **signatureMethod** 

      - **type** : string

      - **required** : true

<a name="oauth-methods-requestToken"></a> 

### oauth.requestToken(options, callback)

authorize by oauth

- **options** 

  - **type** : object

  - **required** : true

  - **properties**

    - **requestUrl** 

      - **description** : the requested service url

      - **type** : string

      - **required** : true

    - **accessUrl** 

      - **description** : the access url for said service

      - **type** : string

      - **required** : true

    - **consumerKey** 

      - **type** : string

      - **required** : true

    - **consumerSecret** 

      - **type** : string

      - **required** : true

    - **version** 

      - **type** : string

      - **required** : true

    - **authorize_callback** 

      - **description** : url to be sent back to on authorization

      - **type** : string

      - **required** : true

    - **signatureMethod** 

      - **type** : string

      - **required** : true

- **callback** 

  - **required** : true

  - **default** : function (error, oauthToken, oauthTokenSecret, results) {
        if (error) {
          logger.error(error);
        }
        else {
          logger.info('oauth token:', oauthToken);
          logger.info('oauth token secret:', oauthTokenSecret);
        }
      }

<a name="oauth-methods-accessToken"></a> 

### oauth.accessToken(options, callback)

get oauth access token

- **options** 

  - **required** : true

  - **properties**

    - **requestToken** 

      - **required** : true

    - **requestTokenSecret** 

      - **required** : true

    - **oauthVerifier** 

      - **required** : false

- **callback** 

  - **required** : true

  - **default** : function (error, accessToken, accessTokenSecret, results) {
        if (error) {
          logger.error(error);
        }
        else {
          logger.info('oauth access token:', accessToken);
          logger.info('oauth access token secret:', accessTokenSecret);
        }
      }



## dependencies 
- [oauth](http://npmjs.org/package/oauth) v~0.9.8


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*