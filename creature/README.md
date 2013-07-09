# creature


example resource for creatures like dragons, unicorns, and ponies



## API

#### [properties](#creature-properties)

  - [id](#creature-properties-id)

  - [type](#creature-properties-type)

  - [life](#creature-properties-life)

  - [isAwesome](#creature-properties-isAwesome)


#### [methods](#creature-methods)

  - [create](#creature-methods-create) (options, callback)

  - [get](#creature-methods-get) (id, callback)

  - [find](#creature-methods-find) (options, callback)

  - [all](#creature-methods-all) (callback)

  - [update](#creature-methods-update) (options, callback)

  - [updateOrCreate](#creature-methods-updateOrCreate) (options, callback)

  - [destroy](#creature-methods-destroy) (id, callback)

  - [poke](#creature-methods-poke) ()

  - [fire](#creature-methods-fire) (options)

  - [talk](#creature-methods-talk) (text)



<a name="creature-properties"></a>

## properties 
example resource for creatures like dragons, unicorns, and ponies

- **id** 

  - **type** : any

- **type** 

  - **type** : string

  - **enum**

    - 0 : *dragon*

    - 1 : *unicorn*

    - 2 : *pony*

  - **default** : dragon

- **life** 

  - **type** : number

  - **default** : 10

- **isAwesome** 

  - **type** : boolean

  - **default** : true



<a name="creature-methods"></a> 

## methods 

<a name="creature-methods-create"></a> 

### creature.create(options, callback)

create a new creature

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **type** 

      - **type** : string

      - **enum**

        - 0 : *dragon*

        - 1 : *unicorn*

        - 2 : *pony*

      - **default** : dragon

    - **life** 

      - **type** : number

      - **default** : 10

    - **isAwesome** 

      - **type** : boolean

      - **default** : true

- **callback** 

  - **type** : function

<a name="creature-methods-get"></a> 

### creature.get(id, callback)

get creature by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="creature-methods-find"></a> 

### creature.find(options, callback)

search for instances of creature

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **type** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **life** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **isAwesome** 

      - **type** : any

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="creature-methods-all"></a> 

### creature.all(callback)

gets all instances of creature

- **callback** 

  - **type** : function

<a name="creature-methods-update"></a> 

### creature.update(options, callback)

updates a creature by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **type** 

      - **type** : string

      - **enum**

        - 0 : *dragon*

        - 1 : *unicorn*

        - 2 : *pony*

      - **default** : dragon

    - **life** 

      - **type** : number

      - **default** : 10

    - **isAwesome** 

      - **type** : boolean

      - **default** : true

- **callback** 

  - **type** : function

<a name="creature-methods-updateOrCreate"></a> 

### creature.updateOrCreate(options, callback)

updates a creature by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **type** 

      - **type** : string

      - **enum**

        - 0 : *dragon*

        - 1 : *unicorn*

        - 2 : *pony*

      - **default** : dragon

    - **life** 

      - **type** : number

      - **default** : 10

    - **isAwesome** 

      - **type** : boolean

      - **default** : true

- **callback** 

  - **type** : function

<a name="creature-methods-destroy"></a> 

### creature.destroy(id, callback)

destroys a creature by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="creature-methods-poke"></a> 

### creature.poke()



<a name="creature-methods-fire"></a> 

### creature.fire(options)

fires a lazer at a certain power and direction

- **options** 

  - **type** : object

  - **properties**

    - **power** 

      - **type** : number

      - **default** : 1

      - **required** : true

    - **direction** 

      - **type** : string

      - **enum**

        - 0 : *up*

        - 1 : *down*

        - 2 : *left*

        - 3 : *right*

      - **required** : true

      - **default** : up

  - **callback**

    - type : *function*

    - required : *false*

<a name="creature-methods-talk"></a> 

### creature.talk(text)

echos back a string

- **text** 

  - **type** : string

  - **default** : hello!

  - **required** : true





*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*