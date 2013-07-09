# queue


a queue for resource events



## API

#### [properties](#queue-properties)

  - [id](#queue-properties-id)

  - [concurrency](#queue-properties-concurrency)

  - [interval](#queue-properties-interval)

  - [wait](#queue-properties-wait)

  - [repeat](#queue-properties-repeat)

  - [elements](#queue-properties-elements)

  - [started](#queue-properties-started)

  - [inProgress](#queue-properties-inProgress)


#### [methods](#queue-methods)

  - [create](#queue-methods-create) (options, callback)

  - [get](#queue-methods-get) (id, callback)

  - [find](#queue-methods-find) (options, callback)

  - [all](#queue-methods-all) (callback)

  - [update](#queue-methods-update) (options, callback)

  - [updateOrCreate](#queue-methods-updateOrCreate) (options, callback)

  - [destroy](#queue-methods-destroy) (id, callback)

  - [push](#queue-methods-push) (id, job, callback)

  - [shift](#queue-methods-shift) (id, callback)

  - [unshift](#queue-methods-unshift) (id, job, callback)

  - [take](#queue-methods-take) (id, callback)

  - [extend](#queue-methods-extend) (id, elems, callback)

  - [run](#queue-methods-run) (job, callback)

  - [process](#queue-methods-process) (id, callback)

  - [start](#queue-methods-start) (id, callback)

  - [stop](#queue-methods-stop) (id, callback)



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

- **elements** 

  - **description** : the elements currently inside the queue

  - **type** : array

  - **default**

- **started** 

  - **description** : whether or not the queue has been started

  - **type** : boolean

  - **default** : false

- **inProgress** 

  - **description** : the elements currently being processed

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

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

    - **started** 

      - **description** : whether or not the queue has been started

      - **type** : boolean

      - **default** : false

    - **inProgress** 

      - **description** : the elements currently being processed

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

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : any

      - **default** : 

      - **required** : false

    - **started** 

      - **description** : whether or not the queue has been started

      - **type** : any

      - **default** : 

      - **required** : false

    - **inProgress** 

      - **description** : the elements currently being processed

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

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

    - **started** 

      - **description** : whether or not the queue has been started

      - **type** : boolean

      - **default** : false

    - **inProgress** 

      - **description** : the elements currently being processed

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

    - **elements** 

      - **description** : the elements currently inside the queue

      - **type** : array

      - **default**

    - **started** 

      - **description** : whether or not the queue has been started

      - **type** : boolean

      - **default** : false

    - **inProgress** 

      - **description** : the elements currently being processed

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

### queue.push(id, job, callback)

push an element onto the queue

- **id** 

  - **type** : any

- **job** 

  - **properties**

    - **method** 

      - **type** : string

    - **with** 

      - **type** : any

      - **default**

- **callback** 

  - **type** : function

  - **default** : function (err, _queue) {
        if (err) {
          queue.emit('error', err, _queue);
        }
      }

<a name="queue-methods-shift"></a> 

### queue.shift(id, callback)

shift an element off the queue

- **id** 

  - **type** : any

- **callback** 

  - **type** : function

  - **default** : function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }

<a name="queue-methods-unshift"></a> 

### queue.unshift(id, job, callback)

unshift an element onto the front of the queue

- **id** 

  - **type** : any

- **job** 

  - **properties**

    - **method** 

      - **type** : string

    - **with** 

      - **type** : any

      - **default**

- **callback** 

  - **type** : function

  - **default** : function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }

<a name="queue-methods-take"></a> 

### queue.take(id, callback)

take `queue.concurrency` elements off the queue

- **id** 

  - **type** : any

- **callback** 

  - **type** : function

  - **default** : function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }

<a name="queue-methods-extend"></a> 

### queue.extend(id, elems, callback)

extend the queue with an array of elements

- **id** 

  - **type** : any

- **elems** 

  - **type** : any

- **callback** 

  - **type** : function

  - **default** : function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }

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

### queue.process(id, callback)

process elements off the queue

- **id** 

  - **type** : any

- **callback** 

  - **type** : function

  - **required** : true

<a name="queue-methods-start"></a> 

### queue.start(id, callback)

start processing a queue

- **id** 

  - **type** : any

- **callback** 

  - **type** : function

  - **default** : function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }

<a name="queue-methods-stop"></a> 

### queue.stop(id, callback)

start processing a queue

- **id** 

  - **type** : any

- **callback** 

  - **type** : function

  - **default** : function (err) {
        if (err) {
          queue.emit('error', err);
        }
      }





*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*