# account

for managing accounts

## API

#### [properties](#account-properties)

  - [id](#account-properties-id)

  - [email](#account-properties-email)

  - [password](#account-properties-password)

  - [status](#account-properties-status)

  - [token](#account-properties-token)


#### [methods](#account-methods)

  - [confirm](#account-methods-confirm) (token)

  - [reset](#account-methods-reset) (email)

  - [auth](#account-methods-auth) (accountname, password)

  - [create](#account-methods-create) ()


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

### account.auth(accountname, password)

checks accountname and password for a account ( auth check )

- **accountname** 

  - **type** : string

  - **required** : true

- **password** 

  - **type** : string

  - **required** : true

<a name="account-methods-create"></a> 

### account.create()


## dependencies 

*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*