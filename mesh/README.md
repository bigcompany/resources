# mesh


provides a distributed p2p event emitter mesh



## API

#### [properties](#mesh-properties)

  - [id](#mesh-properties-id)


#### [methods](#mesh-methods)

  - [connect](#mesh-methods-connect) (options, callback)

  - [listen](#mesh-methods-listen) (options, callback)

  - [downlink](#mesh-methods-downlink) (options, callback)

  - [uplink](#mesh-methods-uplink) (options, callback)



provides a distributed p2p event emitter mesh

- **id** 

  - **type** : any



<a name="mesh-methods"></a> 

## methods 

<a name="mesh-methods-connect"></a> 

### mesh.connect(options, callback)

connect to the big mesh

- **options** 

  - **type** : object

  - **properties**

    - **port** 

      - **type** : number

      - **default** : 7777

      - **description** : the port of the node

    - **host** 

      - **type** : string

      - **default** : 0.0.0.0

      - **description** : the host of the node

- **callback** 

  - **description** : the callback executed after connecting to mesh

  - **type** : function

  - **required** : false

<a name="mesh-methods-listen"></a> 

### mesh.listen(options, callback)

listens for incoming nodes

- **options** 

  - **type** : object

  - **properties**

    - **port** 

      - **type** : number

      - **default** : 7777

      - **description** : the port of the node

    - **host** 

      - **type** : string

      - **default** : 0.0.0.0

      - **description** : the host of the node

- **callback** 

  - **description** : the callback executed after connecting to mesh

  - **type** : function

  - **required** : false

<a name="mesh-methods-downlink"></a> 

### mesh.downlink(options, callback)

when an incoming node connection has been made

- **options** 

  - **type** : object

- **callback** 

  - **description** : the callback executed after connecting to mesh

  - **type** : function

  - **required** : false

<a name="mesh-methods-uplink"></a> 

### mesh.uplink(options, callback)

when an outgoing node connection has been made

- **options** 

  - **type** : object

- **callback** 

  - **description** : the callback executed after connecting to mesh

  - **type** : function

  - **required** : false



## dependencies 
- [engine.io](http://npmjs.org/package/engine.io) v0.3.9
- [engine.io-client](http://npmjs.org/package/engine.io-client) v0.3.9
- [eventemitter2](http://npmjs.org/package/eventemitter2)


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*