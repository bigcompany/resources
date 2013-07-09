# node


for managing nodes



## API

#### [properties](#node-properties)

  - [id](#node-properties-id)

  - [port](#node-properties-port)

  - [host](#node-properties-host)

  - [name](#node-properties-name)

  - [events](#node-properties-events)

  - [username](#node-properties-username)

  - [role](#node-properties-role)

  - [status](#node-properties-status)

  - [password](#node-properties-password)

  - [system](#node-properties-system)

  - [lastSeen](#node-properties-lastSeen)


#### [methods](#node-methods)

  - [create](#node-methods-create) (options, callback)

  - [get](#node-methods-get) (id, callback)

  - [find](#node-methods-find) (options, callback)

  - [all](#node-methods-all) (callback)

  - [update](#node-methods-update) (options, callback)

  - [updateOrCreate](#node-methods-updateOrCreate) (options, callback)

  - [destroy](#node-methods-destroy) (id, callback)

  - [sh](#node-methods-sh) (options, callback)



<a name="node-properties"></a>

## properties 
for managing nodes

- **id** 

  - **type** : any

- **port** 

  - **type** : number

  - **default** : 7777

  - **description** : the port of the node

- **host** 

  - **type** : string

  - **default** : 0.0.0.0

  - **description** : the host of the node

- **name** 

  - **type** : string

  - **description** : the name of the node

- **events** 

  - **description** : the total amount of events processed by this node

  - **type** : number

- **username** 

  - **description** : the username used to log into the node

  - **type** : string

  - **default** : root

  - **required** : false

- **role** 

  - **description** : the role of the node

  - **type** : string

  - **enum**

    - 0 : *server*

    - 1 : *client*

  - **default** : client

- **status** 

  - **description** : the status of the node

  - **type** : string

  - **enum**

    - 0 : *connected*

    - 1 : *disconnected*

  - **default** : disconnected

- **password** 

  - **description** : the password used to log into the node

  - **type** : string

  - **required** : false

- **system** 

  - **description** : a dump of the node's system information ( from node.process and require('os') module )

  - **type** : any

- **lastSeen** 

  - **description** : the last date/time the node was seen

  - **type** : string



<a name="node-methods"></a> 

## methods 

<a name="node-methods-create"></a> 

### node.create(options, callback)

create a new node

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **port** 

      - **type** : number

      - **default** : 7777

      - **description** : the port of the node

    - **host** 

      - **type** : string

      - **default** : 0.0.0.0

      - **description** : the host of the node

    - **name** 

      - **type** : string

      - **description** : the name of the node

    - **events** 

      - **description** : the total amount of events processed by this node

      - **type** : number

    - **username** 

      - **description** : the username used to log into the node

      - **type** : string

      - **default** : root

      - **required** : false

    - **role** 

      - **description** : the role of the node

      - **type** : string

      - **enum**

        - 0 : *server*

        - 1 : *client*

      - **default** : client

    - **status** 

      - **description** : the status of the node

      - **type** : string

      - **enum**

        - 0 : *connected*

        - 1 : *disconnected*

      - **default** : disconnected

    - **password** 

      - **description** : the password used to log into the node

      - **type** : string

      - **required** : false

    - **system** 

      - **description** : a dump of the node's system information ( from node.process and require('os') module )

      - **type** : any

    - **lastSeen** 

      - **description** : the last date/time the node was seen

      - **type** : string

- **callback** 

  - **type** : function

<a name="node-methods-get"></a> 

### node.get(id, callback)

get node by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="node-methods-find"></a> 

### node.find(options, callback)

search for instances of node

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **port** 

      - **type** : any

      - **default** : 

      - **description** : the port of the node

      - **required** : false

    - **host** 

      - **type** : any

      - **default** : 

      - **description** : the host of the node

      - **required** : false

    - **name** 

      - **type** : any

      - **description** : the name of the node

      - **default** : 

      - **required** : false

    - **events** 

      - **description** : the total amount of events processed by this node

      - **type** : any

      - **default** : 

      - **required** : false

    - **username** 

      - **description** : the username used to log into the node

      - **type** : any

      - **default** : 

      - **required** : false

    - **role** 

      - **description** : the role of the node

      - **type** : any

      - **default** : 

      - **required** : false

    - **status** 

      - **description** : the status of the node

      - **type** : any

      - **default** : 

      - **required** : false

    - **password** 

      - **description** : the password used to log into the node

      - **type** : any

      - **required** : false

      - **default** : 

    - **system** 

      - **description** : a dump of the node's system information ( from node.process and require('os') module )

      - **type** : any

      - **default** : 

      - **required** : false

    - **lastSeen** 

      - **description** : the last date/time the node was seen

      - **type** : any

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="node-methods-all"></a> 

### node.all(callback)

gets all instances of node

- **callback** 

  - **type** : function

<a name="node-methods-update"></a> 

### node.update(options, callback)

updates a node by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **port** 

      - **type** : number

      - **default** : 7777

      - **description** : the port of the node

    - **host** 

      - **type** : string

      - **default** : 0.0.0.0

      - **description** : the host of the node

    - **name** 

      - **type** : string

      - **description** : the name of the node

    - **events** 

      - **description** : the total amount of events processed by this node

      - **type** : number

    - **username** 

      - **description** : the username used to log into the node

      - **type** : string

      - **default** : root

      - **required** : false

    - **role** 

      - **description** : the role of the node

      - **type** : string

      - **enum**

        - 0 : *server*

        - 1 : *client*

      - **default** : client

    - **status** 

      - **description** : the status of the node

      - **type** : string

      - **enum**

        - 0 : *connected*

        - 1 : *disconnected*

      - **default** : disconnected

    - **password** 

      - **description** : the password used to log into the node

      - **type** : string

      - **required** : false

    - **system** 

      - **description** : a dump of the node's system information ( from node.process and require('os') module )

      - **type** : any

    - **lastSeen** 

      - **description** : the last date/time the node was seen

      - **type** : string

- **callback** 

  - **type** : function

<a name="node-methods-updateOrCreate"></a> 

### node.updateOrCreate(options, callback)

updates a node by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **port** 

      - **type** : number

      - **default** : 7777

      - **description** : the port of the node

    - **host** 

      - **type** : string

      - **default** : 0.0.0.0

      - **description** : the host of the node

    - **name** 

      - **type** : string

      - **description** : the name of the node

    - **events** 

      - **description** : the total amount of events processed by this node

      - **type** : number

    - **username** 

      - **description** : the username used to log into the node

      - **type** : string

      - **default** : root

      - **required** : false

    - **role** 

      - **description** : the role of the node

      - **type** : string

      - **enum**

        - 0 : *server*

        - 1 : *client*

      - **default** : client

    - **status** 

      - **description** : the status of the node

      - **type** : string

      - **enum**

        - 0 : *connected*

        - 1 : *disconnected*

      - **default** : disconnected

    - **password** 

      - **description** : the password used to log into the node

      - **type** : string

      - **required** : false

    - **system** 

      - **description** : a dump of the node's system information ( from node.process and require('os') module )

      - **type** : any

    - **lastSeen** 

      - **description** : the last date/time the node was seen

      - **type** : string

- **callback** 

  - **type** : function

<a name="node-methods-destroy"></a> 

### node.destroy(id, callback)

destroys a node by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="node-methods-sh"></a> 

### node.sh(options, callback)

execute shell scripts on a node via SSH

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **type** : string

      - **default** : 0.0.0.0

    - **recipe** 

      - **description** : name to the shell script to run remotely

      - **type** : string

      - **default** : ls-test

- **callback** 

  - **type** : function





*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*