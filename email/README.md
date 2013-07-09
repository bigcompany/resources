# email


for sending emails



## API

#### [properties](#email-properties)

  - [id](#email-properties-id)

  - [to](#email-properties-to)

  - [from](#email-properties-from)

  - [subject](#email-properties-subject)

  - [cc](#email-properties-cc)

  - [bcc](#email-properties-bcc)

  - [body](#email-properties-body)


#### [methods](#email-methods)

  - [send](#email-methods-send) (options, callback)



<a name="email-properties"></a>

## properties 
for sending emails

- **id** 

  - **type** : any

- **to** 

  - **type** : string

  - **description** : where the email will be sent to

- **from** 

  - **type** : string

  - **description** : where the email will be sent from

- **subject** 

  - **type** : string

  - **description** : the subject of the email

- **cc** 

  - **type** : string

  - **description** : where to send carbon copies

- **bcc** 

  - **type** : string

  - **description** : where to send blind carbon copies

- **body** 

  - **type** : string

  - **description** : the content of the email



<a name="email-methods"></a> 

## methods 

<a name="email-methods-send"></a> 

### email.send(options, callback)

sends an email

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **to** 

      - **type** : string

      - **description** : where the email will be sent to

    - **from** 

      - **type** : string

      - **description** : where the email will be sent from

    - **subject** 

      - **type** : string

      - **description** : the subject of the email

    - **cc** 

      - **type** : string

      - **description** : where to send carbon copies

    - **bcc** 

      - **type** : string

      - **description** : where to send blind carbon copies

    - **body** 

      - **type** : string

      - **description** : the content of the email

- **callback** 

  - **type** : function





*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*