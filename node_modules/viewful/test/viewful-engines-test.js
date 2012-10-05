var assert = require('assert'),
    vows = require('vows'),
    helpers = require('./helpers'),
    viewful = require('../lib/viewful');

var user = { user : { name: "tobi" } };

vows.describe('viewful-engines-test').addBatch({
  'When using `viewful`': {
    'a new viewful.View({ input: "jade" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "p= user.name",
          input: "jade"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "swig" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>{{user.name}}</p>",
          input: "swig"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "liquor" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>#{user.name}</p>",
          input: "liquor"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "dust" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>{#user}{name}{/user}</p>",
          input: "dust"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "ejs" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p><%= user.name %></p>",
          input: "ejs"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "eco" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p><%= @user.name %></p>",
          input: "eco"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "jazz" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>{user.name}</p>",
          input: "jazz"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "jqtpl" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>${user.name}</p>",
          input: "jqtpl"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "haml" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "%p= user.name",
          input: "haml"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "whiskers" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>{user.name}</p>",
          input: "whiskers"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "haml-coffee" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "%p= @user.name",
          input: "haml-coffee"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "hogan" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>{{user.name}}</p>",
          input: "hogan"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "handlebars" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>{{user.name}}</p>",
          input: "handlebars"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "underscore" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p><%= user.name %></p>",
          input: "underscore"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "qejs" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p><%= user.name %></p>",
          input: "qejs"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "walrus" })': {
      topic: new viewful.View({
        template: "<p>{{user.name}}</p>",
        input: "walrus"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "mustache" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>{{user.name}}</p>",
          input: "mustache"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "dot" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p>{{= it.user.name }}</p>",
          input: "dot"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "just" })': {
      topic: function () {
        viewful.engines.init();
        return new viewful.View({
          template: "<p><%= user.name %></p>",
          input: "just"
        });
      },
      'and calling View.render(user)': helpers.renderSync(user),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    }

  }
}).export(module);

