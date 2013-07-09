# hook


for managing event hooks ( IF this THEN that )



## API

#### [properties](#hook-properties)

  - [id](#hook-properties-id)

  - [if](#hook-properties-if)

  - [then](#hook-properties-then)

  - [with](#hook-properties-with)


#### [methods](#hook-methods)

  - [create](#hook-methods-create) (options, callback)

  - [get](#hook-methods-get) (id, callback)

  - [find](#hook-methods-find) (options, callback)

  - [all](#hook-methods-all) (callback)

  - [update](#hook-methods-update) (options, callback)

  - [updateOrCreate](#hook-methods-updateOrCreate) (options, callback)

  - [destroy](#hook-methods-destroy) (id, callback)

  - [start](#hook-methods-start) ()

  - [bind](#hook-methods-bind) ()



<a name="hook-properties"></a>

## properties 
for managing event hooks ( IF this THEN that )

- **id** 

  - **type** : any

- **if** 

  - **type** : string

  - **description** : the if action

  - **required** : true

- **then** 

  - **type** : string

  - **description** : the then action

  - **required** : true

- **with** 

  - **type** : object

  - **description** : additional data supplied to `then`



<a name="hook-methods"></a> 

## methods 

<a name="hook-methods-create"></a> 

### hook.create(options, callback)

create a new hook

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **if** 

      - **type** : string

      - **description** : the if action

      - **required** : true

    - **then** 

      - **type** : string

      - **description** : the then action

      - **required** : true

    - **with** 

      - **type** : object

      - **description** : additional data supplied to `then`

- **callback** 

  - **type** : function

<a name="hook-methods-get"></a> 

### hook.get(id, callback)

get hook by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="hook-methods-find"></a> 

### hook.find(options, callback)

search for instances of hook

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **if** 

      - **type** : any

      - **description** : the if action

      - **required** : false

      - **default** : 

    - **then** 

      - **type** : any

      - **description** : the then action

      - **required** : false

      - **default** : 

    - **with** 

      - **type** : any

      - **description** : additional data supplied to `then`

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="hook-methods-all"></a> 

### hook.all(callback)

gets all instances of hook

- **callback** 

  - **type** : function

<a name="hook-methods-update"></a> 

### hook.update(options, callback)

updates a hook by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **if** 

      - **type** : string

      - **description** : the if action

      - **required** : true

    - **then** 

      - **type** : string

      - **description** : the then action

      - **required** : true

    - **with** 

      - **type** : object

      - **description** : additional data supplied to `then`

- **callback** 

  - **type** : function

<a name="hook-methods-updateOrCreate"></a> 

### hook.updateOrCreate(options, callback)

updates a hook by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **if** 

      - **type** : string

      - **description** : the if action

      - **required** : true

    - **then** 

      - **type** : string

      - **description** : the then action

      - **required** : true

    - **with** 

      - **type** : object

      - **description** : additional data supplied to `then`

- **callback** 

  - **type** : function

<a name="hook-methods-destroy"></a> 

### hook.destroy(id, callback)

destroys a hook by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="hook-methods-start"></a> 

### hook.start()

loads all hooks into memory

<a name="hook-methods-bind"></a> 

### hook.bind()







*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*