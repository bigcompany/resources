# tag

a simple hierarchical tagging system

## API

#### [properties](#tag-properties)

  - [id](#tag-properties-id)

  - [name](#tag-properties-name)

  - [parentID](#tag-properties-parentID)


#### [methods](#tag-methods)

  - [createTag](#tag-methods-createTag) (options)

  - [getTag](#tag-methods-getTag) (options)


<a name="tag-properties"></a>

## properties 
a simple hierarchical tagging system

- **id** 

  - **type** : any

- **name** 

  - **type** : string

  - **description** : the name of the tag

  - **required** : true

- **parentID** 

  - **type** : string

  - **description** : the parent ID of the tag

  - **key** : tag

  - **default** : 


<a name="tag-methods"></a>

## methods

<a name="tag-methods-createTag"></a> 

### tag.createTag(options)



- **options** 

  - **type** : object

  - **properties**

    - **name** 

      - **type** : string

      - **description** : the name of the tag

      - **required** : true

    - **parentID** 

      - **type** : string

      - **description** : the parent ID of the tag

      - **key** : tag

      - **default** : 

<a name="tag-methods-getTag"></a> 

### tag.getTag(options)



- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : string

      - **description** : the name of the tag

      - **required** : true


## dependencies 

*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*