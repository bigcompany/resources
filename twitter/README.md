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

  - [getStream](#twitter-methods-getStream) (object, callback)

  - [removeStream](#twitter-methods-removeStream) (object, callback)

  - [limit](#twitter-methods-limit) (options, callback)

  - [error](#twitter-methods-error) (error, callback)

  - [send](#twitter-methods-send) (options, callback)

  - [receive](#twitter-methods-receive) (options, callback)

  - [follow](#twitter-methods-follow) (options, callback)

  - [unfollow](#twitter-methods-unfollow) (options, callback)

  - [block](#twitter-methods-block) (options, callback)

  - [report](#twitter-methods-report) (options, callback)

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

  - **properties**

    - **message** 

      - **type** : string

      - **default** : I am big.

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

- **stream** 

  - **description** : a twitter stream

  - **properties**

    - **method** 

      - **type** : string

      - **required** : true

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

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

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

- **callback** 

  - **type** : function

  - **default** : function () {}

<a name="twitter-methods-addStream"></a> 

### twitter.addStream(options, callback)

starts listening to a twitter stream

- **options** 

  - **description** : a twitter stream

  - **properties**

    - **method** 

      - **type** : string

      - **required** : true

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

- **callback** 

  - **type** : function

  - **default** : function (error, options, stream) {}

<a name="twitter-methods-getStream"></a> 

### twitter.getStream(object, callback)

gets an active twitter stream

- **object** 

  - **type** : object

  - **streamId**

    - type : *string*

  - **properties**

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

- **callback** 

  - **type** : function

  - **required** : true

<a name="twitter-methods-removeStream"></a> 

### twitter.removeStream(object, callback)

stops listening to a twitter stream

- **object** 

  - **type** : object

  - **streamId**

    - type : *string*

  - **properties**

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

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

      - **default** : I am big.

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

- **callback** 

  - **default** : function () {
        console.log('sent tweet: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }

<a name="twitter-methods-receive"></a> 

### twitter.receive(options, callback)

receives tweets from activated streams

- **options** 

  - **description** : a twitter tweet

  - **properties**

    - **message** 

      - **type** : string

      - **default** : I am big.

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

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

  - **type** : object

  - **user**

    - description : *a twitter user*

    - **properties** 

      - **id**

        - required : *false*

      - **screenName**

        - type : *string*

        - required : *false*

  - **properties**

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

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

  - **type** : object

  - **user**

    - description : *a twitter user*

    - **properties** 

      - **id**

        - required : *false*

      - **screenName**

        - type : *string*

        - required : *false*

  - **properties**

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

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

      - **required** : false

    - **screenName** 

      - **type** : string

      - **required** : false

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

      - **required** : false

    - **screenName** 

      - **type** : string

      - **required** : false

- **callback** 

  - **type** : function

  - **default** : function () {
        console.log('reported: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }

<a name="twitter-methods-tweetLength"></a> 

### twitter.tweetLength(options, callback)

gets the length of a tweet

- **options** 

  - **description** : a twitter tweet

  - **properties**

    - **message** 

      - **type** : string

      - **default** : I am big.

    - **screenName** 

      - **type** : string

      - **required** : false

    - **id** 

      - **type** : string

      - **required** : false

- **callback** 

  - **type** : function

  - **required** : false


## dependencies 
- [ntwitter](http://npmjs.org/package/ntwitter) v0.5.0

*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*