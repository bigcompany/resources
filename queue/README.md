# queue

a queue for resource events

## API

#### [properties](#queue-properties)

  - [id](#queue-properties-id)

  - [concurrency](#queue-properties-concurrency)

  - [interval](#queue-properties-interval)

  - [wait](#queue-properties-wait)

  - [repeat](#queue-properties-repeat)

  - [autosave](#queue-properties-autosave)

  - [elements](#queue-properties-elements)


#### [methods](#queue-methods)

  - [create](#queue-methods-create) (options, callback)

  - [get](#queue-methods-get) (id, callback)

  - [find](#queue-methods-find) (options, callback)

  - [all](#queue-methods-all) (callback)

  - [update](#queue-methods-update) (options, callback)

  - [updateOrCreate](#queue-methods-updateOrCreate) (options, callback)

  - [destroy](#queue-methods-destroy) (id, callback)

  - [push](#queue-methods-push) (queue, job)

  - [shift](#queue-methods-shift) (options)

  - [take](#queue-methods-take) (options)

  - [extend](#queue-methods-extend) (instance, elems)

  - [run](#queue-methods-run) (job, callback)

  - [process](#queue-methods-process) (options, callback)

  - [load](#queue-methods-load) (options)


<a name="queue-properties"></a>

## properties 
a queue for resource events

- **id** 

  - **type** : any

- **concurrency** 

  - **description** : how many jobs to run at once

  - **type** : number

  - **default** : 1

- **interval** 

  - **description** : time interval between processing items (ms)

  - **type** : number

  - **default** : 5000

- **wait** 

  - **description** : wait until all running jobs are completed before executing next set

  - **type** : boolean

  - **default** : true

- **repeat** 

  - **description** : automatically push completed elements back onto the queue

  - **type** : boolean

  - **default** : false

- **autosave** 

  - **description** : automatically save the queue after a processing step

  - **type** : boolean

  - **default** : true

- **elements** 

  - **description** : the elements currently inside the queue

  - **type** : array

  - **default**


<a name="queue-methods"></a> 

## methods 

<a name="queue-methods-create"></a> 

### queue.create(options, callback)

create a new queue

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : number

      - **default** : 1

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : number

      - **default** : 5000

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : boolean

      - **default** : true

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : boolean

      - **default** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : boolean

      - **default** : true

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

- **callback** 

  - **type** : function

<a name="queue-methods-get"></a> 

### queue.get(id, callback)

get queue by id

- **id** 

  - **type** : any

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="queue-methods-find"></a> 

### queue.find(options, callback)

search for instances of queue

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

      - **default** : 

      - **required** : false

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : any

      - **default** : 

      - **required** : false

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : any

      - **default** : 

      - **required** : false

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : any

      - **default** : 

      - **required** : false

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : any

      - **default** : 

      - **required** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : any

      - **default** : 

      - **required** : false

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : any

      - **default** : 

      - **required** : false

- **callback** 

  - **type** : function

<a name="queue-methods-all"></a> 

### queue.all(callback)

gets all instances of queue

- **callback** 

  - **type** : function

<a name="queue-methods-update"></a> 

### queue.update(options, callback)

updates a queue by id

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : number

      - **default** : 1

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : number

      - **default** : 5000

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : boolean

      - **default** : true

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : boolean

      - **default** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : boolean

      - **default** : true

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

- **callback** 

  - **type** : function

<a name="queue-methods-updateOrCreate"></a> 

### queue.updateOrCreate(options, callback)

updates a queue by id, and creates if necessary

- **options** 

  - **type** : object

  - **properties**

    - **id** 

      - **type** : any

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : number

      - **default** : 1

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : number

      - **default** : 5000

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : boolean

      - **default** : true

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : boolean

      - **default** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : boolean

      - **default** : true

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

- **callback** 

  - **type** : function

<a name="queue-methods-destroy"></a> 

### queue.destroy(id, callback)

destroys a queue by id

- **id** 

  - **type** : string

  - **description** : the id of the object

  - **required** : true

- **callback** 

  - **type** : function

<a name="queue-methods-push"></a> 

### queue.push(queue, job)

push an element onto the queue

- **queue** 

  - **description** : a queue for resource events

  - **properties**

    - **id** 

      - **type** : any

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : number

      - **default** : 1

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : number

      - **default** : 5000

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : boolean

      - **default** : true

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : boolean

      - **default** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : boolean

      - **default** : true

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

- **job** 

  - **properties**

    - **method** 

      - **type** : string

    - **with** 

      - **type** : any

      - **default**

<a name="queue-methods-shift"></a> 

### queue.shift(options)

shift an element off the queue

- **options** 

  - **properties**

    - **id** 

      - **type** : any

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : number

      - **default** : 1

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : number

      - **default** : 5000

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : boolean

      - **default** : true

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : boolean

      - **default** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : boolean

      - **default** : true

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

<a name="queue-methods-take"></a> 

### queue.take(options)

take `queue.concurrency` elements off the queue

- **options** 

  - **properties**

    - **id** 

      - **type** : any

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : number

      - **default** : 1

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : number

      - **default** : 5000

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : boolean

      - **default** : true

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : boolean

      - **default** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : boolean

      - **default** : true

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

<a name="queue-methods-extend"></a> 

### queue.extend(instance, elems)

extend the queue with an array of elements

- **instance** 

  - **properties**

    - **id** 

      - **type** : any

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : number

      - **default** : 1

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : number

      - **default** : 5000

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : boolean

      - **default** : true

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : boolean

      - **default** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : boolean

      - **default** : true

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

- **elems** 

  - **type** : any

<a name="queue-methods-run"></a> 

### queue.run(job, callback)

run a job

- **job** 

  - **properties**

    - **method** 

      - **type** : string

      - **required** : true

    - **with** 

      - **type** : any

      - **default**

- **callback** 

  - **type** : function

<a name="queue-methods-process"></a> 

### queue.process(options, callback)

process elements off the queue

- **options** 

  - **description** : a queue for resource events

  - **properties**

    - **id** 

      - **type** : any

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : number

      - **default** : 1

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : number

      - **default** : 5000

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : boolean

      - **default** : true

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : boolean

      - **default** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : boolean

      - **default** : true

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

- **callback** 

  - **type** : function

<a name="queue-methods-load"></a> 

### queue.load(options)

start processing a queue

- **options** 

  - **description** : a queue for resource events

  - **properties**

    - **id** 

      - **type** : any

    - **concurrency** 

      - **description** : how many jobs to run at once

      - **type** : number

      - **default** : 1

    - **interval** 

      - **description** : time interval between processing items (ms)

      - **type** : number

      - **default** : 5000

    - **wait** 

      - **description** : wait until all running jobs are completed before executing next set

      - **type** : boolean

      - **default** : true

    - **repeat** 

      - **description** : automatically push completed elements back onto the queue

      - **type** : boolean

      - **default** : false

    - **autosave** 

      - **description** : automatically save the queue after a processing step

      - **type** : boolean

      - **default** : true

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**



*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*