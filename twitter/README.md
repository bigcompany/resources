# twitter


for interacting with the Twitter API



## API

#### [properties](#twitter-properties)

  - [id](#twitter-properties-id)

  - [credentials](#twitter-properties-credentials)

  - [user](#twitter-properties-user)

  - [tweet](#twitter-properties-tweet)

  - [stream](#twitter-properties-stream)


#### [methods](#twitter-methods)

  - [connect](#twitter-methods-connect) (options, callback)

  - [disconnect](#twitter-methods-disconnect) (options, callback)

  - [addStream](#twitter-methods-addStream) (options, callback)

  - [getStream](#twitter-methods-getStream) (options, callback)

  - [removeStream](#twitter-methods-removeStream) (object, callback)

  - [limit](#twitter-methods-limit) (options, callback)

  - [error](#twitter-methods-error) (error, callback)

  - [send](#twitter-methods-send) (options, callback)

  - [receive](#twitter-methods-receive) (options, callback)

  - [follow](#twitter-methods-follow) (options, callback)

  - [unfollow](#twitter-methods-unfollow) (options, callback)

  - [block](#twitter-methods-block) (options, callback)

  - [report](#twitter-methods-report) (options, callback)

  - [showUser](#twitter-methods-showUser) (options, callback)

  - [tweetLength](#twitter-methods-tweetLength) (options, callback)



<a name="twitter-properties"></a>

## properties 
for interacting with the Twitter API

- **id** 

  - **type** : any

- **credentials** 

  - **description** : credentials for logging into twitter

  - **properties**

    - type : *object*

    - **consumer_key** 

      - **type** : string

      - **required** : true

    - **consumer_secret** 

      - **type** : string

      - **required** : true

    - **access_token_key** 

      - **type** : string

      - **required** : true

    - **access_token_secret** 

      - **type** : string

      - **required** : true

- **user** 

  - **description** : a twitter user

  - **properties**

    - **id** 

      - **required** : false

    - **screenName** 

      - **type** : string

      - **required** : false

- **tweet** 

  - **description** : a twitter tweet

  - **type** : object

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

    - **follow** 

      - **type** : string

      - **required** : false

    - **track** 

      - **type** : string

      - **required** : false

    - **locations** 

      - **type** : string

      - **required** : false



<a name="twitter-methods"></a> 

## methods 

<a name="twitter-methods-connect"></a> 

### twitter.connect(options, callback)

connects to twitter

- **options** 

  - **description** : credentials for logging into twitter

  - **properties**

    - type : *object*

    - **consumer_key** 

      - **type** : string

      - **required** : true

    - **consumer_secret** 

      - **type** : string

      - **required** : true

    - **access_token_key** 

      - **type** : string

      - **required** : true

    - **access_token_secret** 

      - **type** : string

      - **required** : true

- **callback** 

  - **type** : function

  - **default** : function () {}

<a name="twitter-methods-disconnect"></a> 

### twitter.disconnect(options, callback)

disconnects from twitter

- **options** 

  - **type** : object

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

- **callback** 

  - **type** : function

  - **default** : function () {}

<a name="twitter-methods-addStream"></a> 

### twitter.addStream(options, callback)

starts listening to a twitter stream

- **options** 

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

    - **stream** 

      - **description** : a twitter stream

      - **properties**

        - **method** 

          - **type** : string

          - **required** : true

        - **follow** 

          - **type** : string

          - **required** : false

        - **track** 

          - **type** : string

          - **required** : false

        - **locations** 

          - **type** : string

          - **required** : false

- **callback** 

  - **type** : function

  - **default** : function (error, options, stream) {}

<a name="twitter-methods-getStream"></a> 

### twitter.getStream(options, callback)

gets an active twitter stream

- **options** 

  - **type** : object

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

    - **streamId** 

      - **type** : string

- **callback** 

  - **type** : function

<a name="twitter-methods-removeStream"></a> 

### twitter.removeStream(object, callback)

stops listening to a twitter stream

- **object** 

  - **type** : object

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

    - **streamId** 

      - **type** : string

- **callback** 

  - **type** : function

  - **default** : function (error, options) {}

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

- **callback** 

  - **type** : function

  - **default** : function () {}

<a name="twitter-methods-send"></a> 

### twitter.send(options, callback)

sends a tweet (updates your status)

- **options** 

  - **type** : object

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

    - **message** 

      - **type** : string

      - **required** : true

- **callback** 

  - **default** : function () {
        resource.logger.info('sent tweet: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          resource.logger.info(i + ': ' + arg);
        });
      }

<a name="twitter-methods-receive"></a> 

### twitter.receive(options, callback)

receives tweets from activated streams

- **options** 

  - **description** : a twitter tweet

  - **type** : object

  - **properties**

    - **message** 

      - **type** : string

      - **required** : true

- **callback** 

  - **default** : function () {
        resource.logger.info('received tweet: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          resource.logger.info(i + ': ' + arg);
        });
      }

<a name="twitter-methods-follow"></a> 

### twitter.follow(options, callback)

follows a twitter user

- **options** 

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **required** : false

- **callback** 

  - **type** : function

  - **default** : function () {
        resource.logger.info('followed: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          resource.logger.info(i + ': ' + arg);
        });
      }

<a name="twitter-methods-unfollow"></a> 

### twitter.unfollow(options, callback)

unfollows a twitter user

- **options** 

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **required** : false

- **callback** 

  - **type** : function

  - **default** : function () {
        resource.logger.info('unfollowed: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          resource.logger.info(i + ': ' + arg);
        });
      }

<a name="twitter-methods-block"></a> 

### twitter.block(options, callback)

blocks a twitter user

- **options** 

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **required** : false

- **callback** 

  - **type** : function

  - **default** : function () {
        resource.logger.info('blocked: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          resource.logger.info(i + ': ' + arg);
        });
      }

<a name="twitter-methods-report"></a> 

### twitter.report(options, callback)

reports a twitter user

- **options** 

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **required** : false

- **callback** 

  - **type** : function

  - **default** : function () {
        resource.logger.warn('reported:');
        [].slice.call(arguments).forEach(function (arg, i) {
          resource.logger.warn(i + ': ' + arg);
        });
      }

<a name="twitter-methods-showUser"></a> 

### twitter.showUser(options, callback)

shows information on a twitter user

- **options** 

  - **properties**

    - **user** 

      - **description** : a twitter user

      - **properties**

        - **id** 

          - **required** : false

        - **screenName** 

          - **type** : string

          - **required** : false

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **required** : false

- **callback** 

  - **type** : function

<a name="twitter-methods-tweetLength"></a> 

### twitter.tweetLength(options, callback)

gets the length of a tweet

- **options** 

  - **description** : a twitter tweet

  - **type** : object

  - **properties**

    - **message** 

      - **type** : string

      - **required** : true

- **callback** 

  - **type** : function

  - **required** : false



## dependencies 
- [ntwitter](http://npmjs.org/package/ntwitter) v0.5.0
- [twitter-text](http://npmjs.org/package/twitter-text) v1.5.2


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*