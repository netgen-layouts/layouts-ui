define(['underscore', 'backbone', 'app'], function(_, Backbone, App){
  'use strict';

  return Backbone.Model.extend({

    initialize: function(){
      Backbone.Model.prototype.initialize.apply(this, arguments);
      this.on('error', this.error_handler);
      return this;
    },

    get: function(attr) {
      // Call the getter if available
      if (attr in this) {
        return _.isFunction(this[attr]) ? this[attr].call(this) : this[attr];
      }

      return Backbone.Model.prototype.get.call(this, attr);
    },

    error_handler: function(model, response){
      console.log(response.responseJSON);
      App.show_error({
        model: model,
        title:  response.responseJSON.status_text,
        body: response.responseJSON.message
      });
    },

    //TODO: maybe add this to collection
    trigger: function(name, model, resp, options){
      if(options && options.silent){return this;}
      Backbone.Model.prototype.trigger.apply(this, arguments);
      return this;
    },


    save_via_form: function(view_or_form){
      var $form = view_or_form.jquery ? view_or_form : view_or_form.$('form');
      return $form.ajax_submit({format: this.get('format') })
        .done(function(response){
          this.set(response).trigger('save:success');
        }.bind(this))
        .fail(function(response){
          this.set(response.responseJSON);
          this.error_handler(this, response);
        }.bind(this));
    },

    set: function(key, value, options) {
      var attrs, attr, setter;

      // Normalize the key-value into an object
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      // always pass an options hash around. This allows modifying
      // the options inside the setter
      options = options || {};

      // Go over all the set attributes and call the setter if available
      for (attr in attrs) {
        setter = '$'+attr;
        if (_.isFunction(this[setter])) {
          attrs[attr] = this[setter].call(this, attrs[attr], options);
        }
      }

      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    fetch: function(options){
      options && options.via && _.extend(options, {
        via: options.via,
        url: this.url(options.via)
      });
      return  Backbone.Model.prototype.fetch.call(this, options);
    },

    urlRoot: function(){
      if(this.content_browser){
        return App.env.cb_base_url + _.result(this, 'path');
      }else{
        return App.env.base_url + _.result(this, 'path');
      }
    },

    url: function(additional){
      additional  = additional ? additional : '';
      var url = Backbone.Model.prototype.url.apply(this, arguments);
      return this.url_format(url, additional);
    },

    url_format: function(url, additional){
      additional  = additional ? '/' + additional : '';
      return this.format ? url + additional + '.'+ this.format : url + additional;
    },

    set_if_empty: function(key, value){
      return !this.has(key) && this.set(key, value);
    },


    is_selected: function(){
      return this.get('selected');
    },

    selected_children: function(){
      return _.filter(this.children(), function(item){
        return item.get('selected');
      });
    },

    select: function(){
      this.children && _.invoke(this.children(), 'select');
      this.set({selected: true, indeterminate: false});
      this.children && this.detect_indeterminate();
      this.trigger('select');
      return this;
    },

    unselect: function(){
      this.children && _.invoke(this.children(), 'unselect');
      this.set({selected: false, indeterminate: false});
      this.children && this.detect_indeterminate();
      this.trigger('unselect');
      return this;
    },

    countable: function(){
      if(this.parent && this.parent()){
        return this.parent().get('indeterminate') !== false && this.get('selected') && !this.get('indeterminate');
      }else{
        return this.get('selected') && !this.get('indeterminate');
      }
    },


    detect_indeterminate: function(){
      var parent = this.parent(),
          selected_siblings = _.filter(this.siblings(), function(m){ return m.get('selected'); }),
          _l = selected_siblings.length;
      if(parent){
        if(_l === 0){
          parent.set({selected: false, indeterminate: false});
        }else{
          parent.set({selected: true, indeterminate: parent.children().length !== _l});
        }
      }
      return this;
    },


    add_to_set: function(attr, value){
      this.set(attr, _.union(this.get(attr) || [], [value]));
      return this;
    },

    remove_from_set: function(attr, value){
      this.set(attr, _.without(this.get(attr) || [], value));
      return this;
    },

    snapshot: function(){
      this.state = _.extend({}, this.attributes);
      console.log(this.state);
      return this;
    },

    revert: function(opts){
      opts || (opts = {});
      this.attributes = _.extend({}, this.state);
      !opts.silent && this.trigger('change', this.attributes);
      return this;
    }


  });


});
