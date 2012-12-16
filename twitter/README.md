# twitter



## API

#### [properties](#twitter-properties)

  - [id](#twitter-properties-id)

  - [credentials](#twitter-properties-credentials)

  - [user](#twitter-properties-user)

  - [tweet](#twitter-properties-tweet)

  - [stream](#twitter-properties-stream)


#### [methods](#twitter-methods)

  - [connect](#twitter-methods-connect) (options, callback)

  - [disconnect](#twitter-methods-disconnect) (callback)

  - [stream](#twitter-methods-stream) (description, properties)

  - [limit](#twitter-methods-limit) (options, callback)

  - [error](#twitter-methods-error) (error, callback)

  - [send](#twitter-methods-send) (options, callback)

  - [receive](#twitter-methods-receive) (options, callback)

  - [follow](#twitter-methods-follow) (options, callback)

  - [unfollow](#twitter-methods-unfollow) (options, callback)

  - [block](#twitter-methods-block) (options, callback)

  - [report](#twitter-methods-report) (options, callback)


<a name="twitter-properties"></a>

## properties 


- **id** 

  - **type** : any

- **credentials** 

  - **description** : credentials for logging into twitter

  - **properties**

    - type : *object*

    - **consumerKey** 

      - **type** : string

      - **required** : true

    - **consumerSecret** 

      - **type** : string

      - **required** : true

    - **tokenKey** 

      - **type** : string

      - **required** : true

    - **tokenSecret** 

      - **type** : string

      - **required** : true

- **user** 

  - **description** : a twitter user

  - **properties**

    - **id** 

      - **type** : string

    - **screenName** 

      - **type** : string

- **tweet** 

  - **description** : a twitter tweet

  - **properties**

    - **message** 

      - **type** : string

      - **required** : true

- **stream** 

  - **description** : a twitter stream

  - **properties**

    - **method** 

      - **type** : string

      - **required** : true


<a name="twitter-methods"></a> 

## methods 

<a name="twitter-methods-connect"></a> 

### twitter.connect(options, callback)

connects to twitter

- **options** 

  - **description** : credentials for logging into twitter

  - **properties**

    - type : *object*

    - **consumerKey** 

      - **type** : string

      - **required** : true

    - **consumerSecret** 

      - **type** : string

      - **required** : true

    - **tokenKey** 

      - **type** : string

      - **required** : true

    - **tokenSecret** 

      - **type** : string

      - **required** : true

- **callback** 

  - **type** : function

  - **default** : function () {}

<a name="twitter-methods-disconnect"></a> 

### twitter.disconnect(callback)

disconnects from twitter

- **callback** 

  - **type** : function

  - **default** : function () {}

<a name="twitter-methods-stream"></a> 

### twitter.stream(description, properties)

streams tweets from a given twitter method

- description : *a twitter stream*

- **properties** 

  - **method**

    - type : *string*

    - required : *true*

<a name="twitter-methods-limit"></a> 

### twitter.limit(options, callback)

collects rate limiting events from twitter

- **options** 

  - **type** : object

- **callback** 

  - **type** : function

  - **default** : function () {}

<a name="twitter-methods-error"></a> 

### twitter.error(error, callback)

collects error events from twitter

- **error** 

  - **type** : object

- **callback** 

  - **type** : function

  - **default** : function () {}

<a name="twitter-methods-send"></a> 

### twitter.send(options, callback)

sends a tweet (updates your status)

- **options** 

  - **description** : a twitter tweet

  - **properties**

    - **message** 

      - **type** : string

      - **required** : true

- **callback** 

  - **default** : function () {
        console.log('sent tweet: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }

<a name="twitter-methods-receive"></a> 

### twitter.receive(options, callback)

receives a tweet from activated streams

- **options** 

  - **description** : a twitter tweet

  - **properties**

    - **message** 

      - **type** : string

      - **required** : true

- **callback** 

  - **default** : function () {
        console.log('received tweet: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }

<a name="twitter-methods-follow"></a> 

### twitter.follow(options, callback)

follows a twitter user

- **options** 

  - **description** : a twitter user

  - **properties**

    - **id** 

      - **type** : string

    - **screenName** 

      - **type** : string

- **callback** 

  - **type** : function

  - **default** : function () {
        console.log('followed: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }

<a name="twitter-methods-unfollow"></a> 

### twitter.unfollow(options, callback)

unfollows a twitter user

- **options** 

  - **description** : a twitter user

  - **properties**

    - **id** 

      - **type** : string

    - **screenName** 

      - **type** : string

- **callback** 

  - **type** : function

  - **default** : function () {
        console.log('unfollowed: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }

<a name="twitter-methods-block"></a> 

### twitter.block(options, callback)

blocks a twitter user

- **options** 

  - **description** : a twitter user

  - **properties**

    - **id** 

      - **type** : string

    - **screenName** 

      - **type** : string

- **callback** 

  - **type** : function

  - **default** : function () {
        console.log('blocked: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }

<a name="twitter-methods-report"></a> 

### twitter.report(options, callback)

reports a twitter user

- **options** 

  - **description** : a twitter user

  - **properties**

    - **id** 

      - **type** : string

    - **screenName** 

      - **type** : string

- **callback** 

  - **type** : function

  - **default** : function () {
        console.log('reported: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }


## dependencies 
- [ntwitter](http://npmjs.org/package/ntwitter)

*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*