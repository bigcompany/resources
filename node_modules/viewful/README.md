# viewful - tiny and consolidated view engine for JavaScript

# Overview

 - **Viewful establishes the minimal amount of convention needed to create JavaScript views.**
 - **Viewful makes no assumptions about your application or templating choices.**

# Features

 - Supports [all templating engines](https://github.com/flatiron/viewful/tree/master/lib/engines) available for JavaScript
 - Seamless loading and mapping of views from the file-system or remote webserver
 - Views can be infinitely nested, i.e. uber-partials / subviews
 - Views contain a very basic <a href="#presenter">Presenter Pattern</a> for assisting in building rich isomorprhic interfaces with graceful no-script fallbacks ( Presenters are more convention than code )

# Installation

## Node

    npm install viewful

# Usage
     
## Views can render strings

### Here is a simple `viewful.View` using a string of [Jade](http://jade-lang.com/)

``` js

var viewful = require('viewful');

var view = new viewful.View({ 
  template: "p= user.name",
  input: "jade" 
});

view.render({ user: { name: "bob" }});

```

**outputs:**

```html
<p>bob</p>
```
### Here is a simple `viewful.View` using a string of [Swig](http://paularmstrong.github.com/swig/)

``` js

var viewful = require('viewful');

var view = new viewful.View({ 
  template: '<p>{{user.name}}</p>',
  input: "swig"
});

view.render({ user: { name: "bob" }});
```

**outputs:**

```html
<p>bob</p>
```
## Views can be loaded from disk

### Assuming there a view on the hard-disk, [like this](https://github.com/flatiron/viewful/tree/master/examples/jade/view)

- view
  - creature
    - create.jade
    - inputs
      - button.jade
      - button.js

Viewful can automatically handle the process of loading template files through the `View.load` method.

```js
var view = new viewful.View({
  path: "./examples/jade/view",
  input: "jade",
  output: "html"
});
```

**Important: By design, a View will not automatically attempt to load template assets on construction.** 

### Templates are loaded using the `View.load` method after the View has been constructed

```js
view.load();
```

### This same operation can also be performed asynchronously

```js
viewful.load(function (err, view) {
  console.log(view);
});
```

### Once the view is loaded, it can be rendered using `View.render`.

```js
var html = view.creature.create.render({ user: { name: "Marak" }});
```

**outputs:**

```html
<p>Marak</p>
```

```js
var html = view.creature.inputs.button.render({ label: "cool" }});
```

**outputs:**

```html
<div>
  <button id="thebutton">cool</button>
</div>
```

<a name="presenter"></a>
# View Presenters
A **Presenter** can be considered a function which performs actions on a rendered **template**. In simple use-cases, you will not write a presenter.

In **Level 1 DOM rendering** ( such as generating server-side HTML to return to the client ), you will not use a **Presenter**. In more advanced use-cases, such as creating rich user-interfaces, you will want to create a **Presenter to act upon your View**. 

Presenters are particularly important when implementing data-binding, browser events ( such as mouse and keyboard ), or graceful no-script compatible fallbacks for complex interfaces.


**TL:DR; View Presenters are advantageous, but not mandatory.**

## Presenter Example: Click a Button to trigger Alert

Assuming there a view on the hard-disk, [like this](https://github.com/flatiron/viewful/tree/master/examples/swig/view/creature/inputs)


- inputs
 - button.html
 - button.js

### button.html

*using [swig](http://paularmstrong.github.com/swig/) for this example, but it could be any [engine](https://github.com/flatiron/viewful/tree/master/lib/engines)*

```html
<div>
  <button id="thebutton">{{label}}</button>
</div>
```
```js
var view = new viewful.View({
  input: "swig",
  path: "./examples/jade/view/creature/inputs",
});

// load the view
view.load();

// render the view
view.inputs.button.render({ label: "Show Alert" });
```
### button.js

```js
module.exports = function (options, callback) {
  // Remark: We get a querySelectorAll poly-fill for free!
  var $ = this.$;
  $('#thebutton').click(function(){
    alert('I am alert!');
  })
}
```

**outputs:**

```html
<div>
  <button id="thebutton">Show Alert</button>
</div>
```

```js
// present the View, triggering event bindings
view.inputs.button.present();
```

If DOM Level 2 Events are available ( such as a browser ! ), the presenter will apply the click event to the button that triggers an alert when the button is clicked.

# API

## `viewful.View` Class

### View.template

Template for the view. In this case, `p= user.name`

### View.render(data)

The render method for the view. Will use `input` and `output` templating engines.

*Note: Based on the templating engine, there might be several other rendering API options available, such as callbacks or streaming.*

### View.load(/* callback */)

A helper method for loading views from a file or a folder, synchronously or asynchronously, on the browser or the server. `View.load` is optional if a `template` string has already been specified in the View constructor.

### View.present(data)

`View.present` is intended to be called on the results of a template rendered with `View.render()`. In the <a href="#presenter">presenter</a>, you can bind Level 2 DOM Events (like a mouse click) to the rendered markup. In simple use-cases, you will not use this method.

## options

### options.path

 - *String* - Path to where your view is located

### options.template

 - *String* - Template for View

### options.input

 - *String* - Input templating engine. Defaults to `HTML`
 
### options.output
 
 - *String* - Output templating engine. Defaults to `HTML`
 
### options.render
 
 - *Function* - Override default rendering method for View
 
### options.present

 - *Function* - Override default presenter method for View

# TODO

  - Add isomorphic browser support
  - Improve documentation and examples
  - Create `viewful` Flatiron plugin
  - Add tests and functionality to engine plugins for handling view presenters
  - Add tests to verify that options are being passed into template engine render function correctly.
  - Add options as optional parameter of View.render(). Currently, template engine plugins can only be configured with options at app.attach().
