# permissions

for managing permissions

## API

#### [properties](#permissions-properties)

  - [id](#permissions-properties-id)

  - [accountID](#permissions-properties-accountID)

  - [event](#permissions-properties-event)


#### [methods](#permissions-methods)

  - [create](#permissions-methods-create) (options, callback)

  - [get](#permissions-methods-get) (id, callback)

  - [find](#permissions-methods-find) (options, callback)

  - [all](#permissions-methods-all) (callback)

  - [update](#permissions-methods-update) (options, callback)

  - [destroy](#permissions-methods-destroy) (id, callback)


<a name="permissions-properties"></a>

## properties 
for managing permissions

- **id** 

  - **type** : any

- **accountID** 

  - **type** : string

  - **default** : my title

  - **key** : account

  - **description** : the account to apply permission to

- **event** 

  - **type** : string

  - **description** : the link to the permissions on a third party site

  - **format** : permissions


<a name="permissions-methods"></a> 

## methods 

<a name="permissions-methods-create"></a> 

### permissions.create(options, callback)

create a new permissions

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **accountID** 

      - **type** : string

      - **default** : my title

      - **key** : account

      - **description** : the account to apply permission to

    - **event** 

      - **type** : string

      - **description** : the link to the permissions on a third party site

      - **format** : permissions

- **callback** 

  - **type** : function

<a name="permissions-methods-get"></a> 

### permissions.get(id, callback)

get permissions by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="permissions-methods-find"></a> 

### permissions.find(options, callback)

search for instances of permissions

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **accountID** 

      - **type** : any

      - **default** : 

      - **key** : account

      - **description** : the account to apply permission to

      - **required** : false

    - **event** 

      - **type** : any

      - **description** : the link to the permissions on a third party site

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="permissions-methods-all"></a> 

### permissions.all(callback)

gets all instances of permissions

- **callback** 

  - **type** : function

<a name="permissions-methods-update"></a> 

### permissions.update(options, callback)

updates a permissions by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **accountID** 

      - **type** : string

      - **default** : my title

      - **key** : account

      - **description** : the account to apply permission to

    - **event** 

      - **type** : string

      - **description** : the link to the permissions on a third party site

      - **format** : permissions

- **callback** 

  - **type** : function

<a name="permissions-methods-destroy"></a> 

### permissions.destroy(id, callback)

destroys a permissions by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function



*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*