(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'handlebars', 'app'], factory); // AMD
    } else if (typeof module.exports === 'object') {
       module.exports = factory(); // Node
    } else {
        factory(window.helpers); // Browser global
    }
}(function (_, Handlebars, App){
  'use strict';

  var safe = function(str){
    return new Handlebars.SafeString(str);
  };

  var Helpers = {

    t: function(key){
      return App.i18n.t(key);
    },

    num_prefix: function(num){
      if(num > 0){return "+";}
      //if(num < 0){return "-";}
    },

    debug: function(what){
      console.log(what);
      return null;
    },

    yield: function(opts){
      var attributes = _.extend({
        'data-yield': this.view.cid
      }, opts.hash);

      var string_attributes = _.map(attributes, function(v, k){ return k+'='+v; }).join(' ');

      return new Handlebars.SafeString('<div '+string_attributes+'></div>');
    },

    active_if: function(a, b){
      return a == b ? safe('class="active"') : ''; // jshint ignore:line
    },

    active_class_if: function(a, b){
      return a == b ? safe('active') : ''; // jshint ignore:line
    },

    when: function(what, opts){
      return what ? opts.hash.then : opts.hash['else'];
    },

    selected: function(a, b){
      return a == b ? safe('selected="selected"') : '';  // jshint ignore:line
    },

    animated_number: function(model, attribute, opts){
      var start = model.previous(attribute) || 0;
      var end = model.get(attribute);
      var format = opts.hash.format ? 'data-format="'+opts.hash.format+'"' : '';
      start = Formatters[opts.hash.format || 'integer'](start);
      return safe('<span class="number_animate" data-bind="'+attribute+'" data-start="'+start+'" data-end="'+end+'" '+format+'>'+start+'</span>');
    },

    highlight: function(input){
      _.defer(function(){
        this.view.$el.animate({fontSize: '1.5em'}, 300).delay(0.3).animate({fontSize: '1em'}, 300);
      }.bind(this));
      return input;
    },

    bar_value: function(model, attribute, opts){
      var value = Helpers.previous(model, attribute);
      var format = opts.hash.format ? 'data-format="'+opts.hash.format+'"' : '';
      value = opts.hash.format ? Formatters[opts.hash.format](value) : value;
      return safe('<span class="bar-value" '+format+'>'+value+'</span>');
    },

    previous: function(model, attribute){
      return model.previous(attribute) || (model.defaults && model.defaults[attribute]) || 0;
    },

    template: function(name, opts){
      return safe(JST[name]({
        inner: safe(opts.fn(this))
      }));
    },

    render: function(name){
      return safe(JST[name](this));
    },

    live: function(attribute){
      var model = this.model, action;

      if(!this.view.live[attribute]){
        for(var attr in this.view.live){
          action = this.view.live[attr];
          if(action.as === attribute){
            attribute = attr;
            break;
          }
        }
      }

      var value = this.view.resolve_live_value(model, attribute);

      return safe('<span data-bind="'+attribute+'">'+value+'</span>');
    },


    contains: function(arr, item, opts){
      if(_.contains(arr, item)){
        opts.fn(this);
      }else{
        opts.inverse(this);
      }
    },

    times: function(count, options){
      var buffer = '';
      _(count).times(function(){
        buffer += options.fn();
      });
      return buffer;
    },

    url_for: function(name, opts){
      return App.router.url_for(name, opts.hash || {});
    },

    link_to: function(title, route, opts){
      var url = App.router.url_for(route, opts.hash || {});
      return safe('<a href="'+url+'">'+title+'</a>');
    },

    absolute_url: function(path, opts){
      var hostname;
      if(/localhost|127\.|192\./.test(location.hostname)){
        hostname = '188.252.173.66'
      }
      var host = opts.hash.hostname || hostname || location.hostname || '',
          port = opts.hash.port || location.port;
          port = port ? ':'+port : '';
      var url = [location.protocol, '//', host, port, '/', path].join('');
      return url;
    }

  };

  return Helpers;

  })
);

