# view

for managing views

## API

#### [properties](#view-properties)

  - [id](#view-properties-id)

  - [path](#view-properties-path)

  - [template](#view-properties-template)

  - [input](#view-properties-input)

  - [output](#view-properties-output)


#### [methods](#view-methods)

  - [create](#view-methods-create) (options)


<a name="view-properties"></a>

## properties 
for managing views

- **id** 

  - **type** : any

- **path** 

  - **type** : string

  - **default** : .

  - **description** : the path to the view

  - **format** : uri

- **template** 

  - **type** : string

  - **description** : the string template of the view

- **input** 

  - **type** : string

- **output** 

  - **type** : string


<a name="view-methods"></a> 

## methods 

<a name="view-methods-create"></a> 

### view.create(options)

creates a new view

- **options** 

  - **type** : object


## dependencies 
- [cheerio](http://npmjs.org/package/cheerio)

*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*