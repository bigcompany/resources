# irc


for managing communication with irc



## API

#### [properties](#irc-properties)

  - [id](#irc-properties-id)

  - [server](#irc-properties-server)

  - [nick](#irc-properties-nick)

  - [channel](#irc-properties-channel)

  - [channels](#irc-properties-channels)

  - [message](#irc-properties-message)

  - [command](#irc-properties-command)


#### [methods](#irc-methods)

  - [wrapColors](#irc-methods-wrapColors) (color, message)

  - [connect](#irc-methods-connect) (options, callback)

  - [disconnect](#irc-methods-disconnect) (options)

  - [send](#irc-methods-send) (options, callback)

  - [receive](#irc-methods-receive) (options, callback)

  - [command](#irc-methods-command) (options)

  - [join](#irc-methods-join) (options)

  - [part](#irc-methods-part) (options)

  - [voice](#irc-methods-voice) (options)

  - [devoice](#irc-methods-devoice) (options)

  - [op](#irc-methods-op) (options)

  - [deop](#irc-methods-deop) (options)

  - [kick](#irc-methods-kick) (options)

  - [ban](#irc-methods-ban) (options)

  - [unban](#irc-methods-unban) (options)



<a name="irc-properties"></a>

## properties 
for managing communication with irc

- **id** 

  - **type** : any

- **server** 

  - **description** : an irc server

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

- **nick** 

  - **default** : biggie

  - **required** : true

- **channel** 

  - **default** : #big

- **channels** 

  - **type** : array

- **message** 

  - **description** : an irc message

  - **properties**

    - **options** 

      - **type** : object

      - **properties**

        - **host** 

          - **description** : the hostname of the irc server

          - **type** : string

          - **default** : irc.freenode.net

        - **port** 

          - **description** : the port of the irc server

          - **type** : number

          - **default** : 6667

        - **to** 

          - **type** : string

          - **default** : #big

        - **message** 

          - **type** : string

          - **default** : big

- **command** 

  - **description** : an irc command

  - **properties**

    - **options** 

      - **type** : object

      - **properties**

        - **host** 

          - **description** : the hostname of the irc server

          - **type** : string

          - **default** : irc.freenode.net

        - **port** 

          - **description** : the port of the irc server

          - **type** : number

          - **default** : 6667

        - **command** 

          - **type** : string



<a name="irc-methods"></a> 

## methods 

<a name="irc-methods-wrapColors"></a> 

### irc.wrapColors(color, message)

wraps text in an irc color code

- **color** 

  - **enum**

    - 0 : *white*

    - 1 : *black*

    - 2 : *dark_blue*

    - 3 : *dark_green*

    - 4 : *light_red*

    - 5 : *dark_red*

    - 6 : *magenta*

    - 7 : *orange*

    - 8 : *yellow*

    - 9 : *light_green*

    - 10 : *cyan*

    - 11 : *light_cyan*

    - 12 : *light_blue*

    - 13 : *light_magenta*

    - 14 : *gray*

    - 15 : *light_gray*

    - 16 : *reset*

- **message** 

  - **type** : string

<a name="irc-methods-connect"></a> 

### irc.connect(options, callback)

connects to an irc server

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **nick** 

      - **default** : biggie

      - **required** : true

    - **channel** 

      - **default** : #big

    - **channels** 

      - **type** : array

- **callback** 

  - **type** : function

<a name="irc-methods-disconnect"></a> 

### irc.disconnect(options)

disconnects from an irc server

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **message** 

      - **type** : string

      - **default** : big irc is disconnected (http://big.vc)

<a name="irc-methods-send"></a> 

### irc.send(options, callback)

sends an irc message

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **to** 

      - **type** : string

      - **default** : #big

    - **message** 

      - **type** : string

      - **default** : big

- **callback** 

  - **required** : false

  - **default** : function () {}

<a name="irc-methods-receive"></a> 

### irc.receive(options, callback)

receives an irc message

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **to** 

      - **type** : string

      - **default** : #big

    - **message** 

      - **type** : string

      - **default** : big

- **callback** 

  - **required** : false

  - **default** : function () {}

<a name="irc-methods-command"></a> 

### irc.command(options)

sends an irc command

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **command** 

      - **type** : string

<a name="irc-methods-join"></a> 

### irc.join(options)

joins an irc channel

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **channel** 

      - **default** : #big

<a name="irc-methods-part"></a> 

### irc.part(options)

leaves an irc channel

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **channel** 

      - **default** : #big

<a name="irc-methods-voice"></a> 

### irc.voice(options)

gives voice to an irc user

- **options** 

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **channel** 

      - **default** : #big

    - **channels** 

      - **type** : array

    - **nick** 

      - **default** : biggie

      - **required** : true

<a name="irc-methods-devoice"></a> 

### irc.devoice(options)

removes voice from an irc user

- **options** 

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **channel** 

      - **default** : #big

    - **channels** 

      - **type** : array

    - **nick** 

      - **default** : biggie

      - **required** : true

<a name="irc-methods-op"></a> 

### irc.op(options)

gives ops to an irc user

- **options** 

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **channel** 

      - **default** : #big

    - **channels** 

      - **type** : array

    - **nick** 

      - **default** : biggie

      - **required** : true

<a name="irc-methods-deop"></a> 

### irc.deop(options)

removes ops from an irc user

- **options** 

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **channel** 

      - **default** : #big

    - **channels** 

      - **type** : array

    - **nick** 

      - **default** : biggie

      - **required** : true

<a name="irc-methods-kick"></a> 

### irc.kick(options)

kicks a user from an irc channel

- **options** 

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **channel** 

      - **default** : #big

    - **channels** 

      - **type** : array

    - **nick** 

      - **default** : biggie

      - **required** : true

<a name="irc-methods-ban"></a> 

### irc.ban(options)

bans a user from an irc channel

- **options** 

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **channel** 

      - **default** : #big

    - **channels** 

      - **type** : array

    - **nick** 

      - **default** : biggie

      - **required** : true

<a name="irc-methods-unban"></a> 

### irc.unban(options)

unbans a user from an irc channel

- **options** 

  - **properties**

    - **host** 

      - **description** : the hostname of the irc server

      - **type** : string

      - **default** : irc.freenode.net

    - **port** 

      - **description** : the port of the irc server

      - **type** : number

      - **default** : 6667

    - **channel** 

      - **default** : #big

    - **channels** 

      - **type** : array

    - **nick** 

      - **default** : biggie

      - **required** : true



## dependencies 
- [irc](http://npmjs.org/package/irc) v0.3.4
- [optimist](http://npmjs.org/package/optimist) v0.3.5


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*