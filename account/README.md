# account


for managing accounts


## Features

 - Signups
 - Confirmations
 - Password Resets



## API

#### [properties](#account-properties)

  - [id](#account-properties-id)

  - [email](#account-properties-email)

  - [password](#account-properties-password)

  - [status](#account-properties-status)

  - [token](#account-properties-token)


#### [methods](#account-methods)

  - [create](#account-methods-create) (options, callback)

  - [get](#account-methods-get) (id, callback)

  - [find](#account-methods-find) (options, callback)

  - [all](#account-methods-all) (callback)

  - [update](#account-methods-update) (options, callback)

  - [updateOrCreate](#account-methods-updateOrCreate) (options, callback)

  - [destroy](#account-methods-destroy) (id, callback)

  - [confirm](#account-methods-confirm) (token)

  - [reset](#account-methods-reset) (email)

  - [auth](#account-methods-auth) (id, password)



<a name="account-properties"></a>

## properties 
for managing accounts

- **id** 

  - **type** : any

- **email** 

  - **type** : string

  - **format** : email

  - **required** : true

- **password** 

  - **type** : string

  - **format** : password

  - **required** : false

- **status** 

  - **description** : the current status of the account

  - **type** : string

  - **enum**

    - 0 : *new*

    - 1 : *active*

    - 2 : *inactive*

    - 3 : *disabled*

  - **default** : new

- **token** 

  - **description** : unique access token for the account. used for account confirmations and password resets

  - **type** : string

  - **private** : true

  - **default** : 



<a name="account-methods"></a> 

## methods 

<a name="account-methods-create"></a> 

### account.create(options, callback)

create a new account

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **email** 

      - **type** : string

      - **format** : email

      - **required** : true

    - **password** 

      - **type** : string

      - **format** : password

      - **required** : false

    - **status** 

      - **description** : the current status of the account

      - **type** : string

      - **enum**

        - 0 : *new*

        - 1 : *active*

        - 2 : *inactive*

        - 3 : *disabled*

      - **default** : new

    - **token** 

      - **description** : unique access token for the account. used for account confirmations and password resets

      - **type** : string

      - **private** : true

      - **default** : 

- **callback** 

  - **type** : function

<a name="account-methods-get"></a> 

### account.get(id, callback)

get account by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="account-methods-find"></a> 

### account.find(options, callback)

search for instances of account

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **email** 

      - **type** : any

      - **required** : false

      - **default** : 

    - **password** 

      - **type** : any

      - **required** : false

      - **default** : 

    - **status** 

      - **description** : the current status of the account

      - **type** : any

      - **default** : 

      - **required** : false

    - **token** 

      - **description** : unique access token for the account. used for account confirmations and password resets

      - **type** : any

      - **private** : true

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="account-methods-all"></a> 

### account.all(callback)

gets all instances of account

- **callback** 

  - **type** : function

<a name="account-methods-update"></a> 

### account.update(options, callback)

updates a account by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **email** 

      - **type** : string

      - **format** : email

      - **required** : true

    - **password** 

      - **type** : string

      - **format** : password

      - **required** : false

    - **status** 

      - **description** : the current status of the account

      - **type** : string

      - **enum**

        - 0 : *new*

        - 1 : *active*

        - 2 : *inactive*

        - 3 : *disabled*

      - **default** : new

    - **token** 

      - **description** : unique access token for the account. used for account confirmations and password resets

      - **type** : string

      - **private** : true

      - **default** : 

- **callback** 

  - **type** : function

<a name="account-methods-updateOrCreate"></a> 

### account.updateOrCreate(options, callback)

updates a account by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **email** 

      - **type** : string

      - **format** : email

      - **required** : true

    - **password** 

      - **type** : string

      - **format** : password

      - **required** : false

    - **status** 

      - **description** : the current status of the account

      - **type** : string

      - **enum**

        - 0 : *new*

        - 1 : *active*

        - 2 : *inactive*

        - 3 : *disabled*

      - **default** : new

    - **token** 

      - **description** : unique access token for the account. used for account confirmations and password resets

      - **type** : string

      - **private** : true

      - **default** : 

- **callback** 

  - **type** : function

<a name="account-methods-destroy"></a> 

### account.destroy(id, callback)

destroys a account by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="account-methods-confirm"></a> 

### account.confirm(token)

confirms a new account based on access token

- **token** 

  - **type** : string

  - **description** : access token

  - **required** : true

  - **message** : access token is required to confirm account

<a name="account-methods-reset"></a> 

### account.reset(email)

resets access token for account

- **email** 

  - **type** : string

  - **format** : email

  - **required** : true

<a name="account-methods-auth"></a> 

### account.auth(id, password)

checks id and password for an account ( auth check )

- **id** 

  - **type** : string

  - **required** : true

- **password** 

  - **type** : string

  - **required** : true





*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*