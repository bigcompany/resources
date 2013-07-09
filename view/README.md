# view


for managing views



## API

#### [properties](#view-properties)

  - [id](#view-properties-id)

  - [path](#view-properties-path)

  - [template](#view-properties-template)

  - [presenter](#view-properties-presenter)


#### [methods](#view-methods)

  - [create](#view-methods-create) (options, callback)



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

- **presenter** 

  - **type** : function

  - **description:** : the presenter function of the view



<a name="view-methods"></a> 

## methods 

<a name="view-methods-create"></a> 

### view.create(options, callback)

creates a new view

- **options** 

  - **type** : object

- **callback** 

  - **type** : function

  - **required** : true



## dependencies 
- [cheerio](http://npmjs.org/package/cheerio) v0.9.x


*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*