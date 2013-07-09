# tag


a simple hierarchical tagging system



## API

#### [properties](#tag-properties)

  - [id](#tag-properties-id)

  - [name](#tag-properties-name)

  - [parentID](#tag-properties-parentID)


#### [methods](#tag-methods)

  - [create](#tag-methods-create) (options, callback)

  - [get](#tag-methods-get) (id, callback)

  - [find](#tag-methods-find) (options, callback)

  - [all](#tag-methods-all) (callback)

  - [update](#tag-methods-update) (options, callback)

  - [updateOrCreate](#tag-methods-updateOrCreate) (options, callback)

  - [destroy](#tag-methods-destroy) (id, callback)

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

<a name="tag-methods-create"></a> 

### tag.create(options, callback)

create a new tag

- **options** 

  - **type** : object

  - **properties**

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

- **callback** 

  - **type** : function

<a name="tag-methods-get"></a> 

### tag.get(id, callback)

get tag by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="tag-methods-find"></a> 

### tag.find(options, callback)

search for instances of tag

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **name** 

      - **type** : any

      - **description** : the name of the tag

      - **required** : false

      - **default** : 

    - **parentID** 

      - **type** : any

      - **description** : the parent ID of the tag

      - **key** : tag

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="tag-methods-all"></a> 

### tag.all(callback)

gets all instances of tag

- **callback** 

  - **type** : function

<a name="tag-methods-update"></a> 

### tag.update(options, callback)

updates a tag by id

- **options** 

  - **type** : object

  - **properties**

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

- **callback** 

  - **type** : function

<a name="tag-methods-updateOrCreate"></a> 

### tag.updateOrCreate(options, callback)

updates a tag by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

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

- **callback** 

  - **type** : function

<a name="tag-methods-destroy"></a> 

### tag.destroy(id, callback)

destroys a tag by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

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





*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*