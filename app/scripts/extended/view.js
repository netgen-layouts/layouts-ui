'use strict';

var Core = require('../core_base');
var $ = Core.$;
var _ = require('underscore');
var Backbone = require('backbone');
var params_parser = require('./params_parser');

module.exports = Core.View = Backbone.View.extend({

  initialize: function(options){
    this.extend_with && options && this._extend_with(options);
    options || (options = {});
    this.ViewItem = this.ViewItem || options.ViewItem;
    this.view_items_el = options.view_items_el || this.view_items_el;
    this.context = _.extend({}, this.context, options.context);
    options.body && (this.context.body = options.body);
    options.template && (this.template = options.template);
    this.template = _.result(this, 'template');
    this.parent = options.parent;
    this.child || (this.child =  options.child);
    this.child && (this.child.parent = this);
    this.render_count = 0;
    this.opts = _.extend({}, this.opts, options.opts);
    this.yield_el = '[data-yield="'+this.cid+'"]';

    this.$el.data('_view', this);

    var what = this.model || this.collection;
    var attrs = {'data-view': ''}
    what && (attrs['data-cid'] = what.cid);
    this.$el.attr(attrs);


    this.default_query = options.default_query || {};
    this.listen_to_filter = options.listen_to_filter || this.listen_to_filter;

    this.render_deps = [];
    this.last_query = {};

    this.prevent_auto_render !== true && this.auto_render();

    if(this.listen_to_filter){
      this.listenTo(Core, 'period:changed', this.load);
    }

    //Delegate event to Core;
    this.on('fh', function(){
      Core.trigger('fh', {view: this});
    });

    this.in_sight = 'in_sight' in options ? options.in_sight : true;

    this.live && this.setup_live_bindings();

    //this.listen_to_filter && Core.on('period:changed', this.load, this);

    return this;
  },

  _extend_with: function(options){
    _.extend(this, _.pick.apply(_, [options].concat(this.extend_with)));
  },



  live_updates: {
    text: function(model, attr, value){
      this.$('[data-bind="'+attr+'"]').html(value);
    },

    text_animate: function(model, attr, value){
      this.$('[data-bind="'+attr+'"]').data('end', value).number_animate();
    },

    typed: function(model, attr, value){
      this.$('[data-bind="'+attr+'"]').html('&nbsp;').typed({
        strings: [value],
        typeSpeed: -50,
        showCursor: false
      }).data('typed', null);
    },

    effect1: function(model, attr, value){
      this.$('[data-bind="'+attr+'"]').css({position: 'relative'})
        .animate({
          //opacity: 0,
          top: '-80px'
        }, 200, function(){
          $(this).html(value);
        }).animate({
          //opacity: 1,
          top: 0
        }, 300);
    }

  },

  hide: function(){
    //this.$('.content').hide();
  },

  show: function(){
    //this.$('.content').show();
  },

  model_on_change: function(model){
    if(!this.in_sight){return;}
    var action, computed_value;
    _.each(model.changed, function(value, attr){
      action = this.live[attr];
      if(!action){return;}
      computed_value = this.resolve_live_value(model, attr);
      if(_.isObject(action)){
        this.live_updates[action.method].call(this, model, attr, computed_value);
      }else{
        this.live_updates[action].call(this, model, attr, computed_value);
      }
    }, this);
    return this;
  },

  resolve_live_value: function(model, attr){
    var action = this.live[attr];
    if(_.isObject(action)){
      return action.fn ? action.fn.call(this, model, attr) : model.get(action.as);
    }else{
      return model.get(attr);
    }
  },

  setup_live_bindings: function(){
    _.map(this.live, function(action, attr){
      return ['change:'+attr];
    }).join(' ');
    this.model && this.listenTo(this.model, 'change', this.model_on_change);
    return this;
  },



  /**
   * Removes element from view and stops all listeners.
   * @method remove
   * @return {Object} [View]
   */
  remove: function() {
    console.log('view:remove', this.template || this.cid);
    this.remove_inner();
    this.$el.remove();
    this.$elements && this.$elements.remove();
    this.stopListening();
    return this;
  },

   /**
   * Empty element and stops all listeners.
   * @method empty
   * @return {Object} [View]
   */
  empty: function() {
    console.log('view:empty', this.template || this.cid);
    this.remove_inner();
    this.$el.empty().off();
    this.$elements && this.$elements.empty().off();
    this.stopListening();
    return this;
  },

  remove_inner: function(){
    this.constructor.remove_views_in_element(this.$el);
  },


  load: function(data){
    data || (data = {});

    this.trigger('load:start', data);
    var default_query = _.result(this, 'default_query');
    var tmp_data = {f: data.f || (Core.complex_filters && Core.complex_filters.serialize_state) || {}};
    var query = _.extend({}, default_query, tmp_data, data.query || {});
    var equal = _.isEqual(this.last_query, query);
    console.log(equal);
    if(equal){return this;}
    var what = this.model || this.collection;
    this.model && data.updates && this.model.set(data.updates);
    var new_xhr = what.fetch({data: query});
    this.last_xhr && this.last_xhr.abort();
    this.last_xhr = new_xhr;
    this.last_query = query;
    return this;
  },

  auto_render: function(){
    this.model && this.listenTo(this.model, 'read:success save:success save:error', this.render_with_new_data);
    this.collection && this.listenTo(this.collection, 'read:success save:success save:error', this.render_with_new_data);
    return this;
  },

  render_with_new_data: function(){
    this.new_data = true;
    this.render();
  },


  delayed_render: function(){
    var self = this;
    this.delayed_render_timeout && clearTimeout(this.delayed_render_timeout);
    this.delayed_render_timeout = setTimeout(function(){
      self.render();
    }, 200);
  },

  render: function(){
    this._render();
    this.trigger_render();
    return this;
  },

  render_to: function(el){
    $(el).html(this.$el);
    return this.render();
  },

  flush: function(){
    this.new_data = false;
    return this;
  },

  trigger_render: function(){
    this.trigger('render', {self: this});
    Core.trigger('render', {view: this});
    return this;
  },

  trigger_with_global: function(event){
    this.trigger(event, {self: this});
    Core.trigger(event, {view: this});
  },

  _render: function(){
    if(!this.in_sight){return false;}
    this.flush();
    this.render_count++;
    this.context = _.extend({
      view: this,
      params: Core.router && Core.router.params,
      model: this.model,
      collection: this.collection
    }, this.context, Core.default_context());

    this.set_context();

    this.$el.html(this.template ? this.render_template() : this.context.body);

    this.render_child();
    this.ViewItem && this.render_items();
    this.new_data = false;
    this.trigger('render:initial', {self: this});
    Core.trigger('render:initial', {view: this});
    console.log('RENDER:', this.template, '|', this.cid, this);
    return this;
  },

  render_child: function(){
    Core.trigger('render:before_child', {view: this});
    this.child && this.yield(this.child);
    return this;
  },


  yield: function(view){
    view.setElement(this.$yield_el().off()).render();
    //console.log(this.$yield_el());
    //this.$yield_el().append(view.render().$el);
    return this;
  },

  $yield_el:function(){
    return this.$(this.yield_el);
  },



  set_context: function(){},


  /**
   * Function finds form input elements(input, select, textarea) in given scope, serializes them and
   * attaches them to this.params (View.params).
   * @method serialize
   * @param  {Object}  scope [jQuery object of DOM elements]
   * @return {Object}        [View]
   */
  serialize: function(scope){
    var form_elements = 'input, select, textarea',
        elements, json;
    if(scope){
      elements = this.$el.find(scope).find(form_elements);
    }else{
      elements = this.$(form_elements, scope);
    }
    json = elements.toJSON();
    this.$elements && _.extend(json, this.$elements.find(form_elements, scope).toJSON());
    var parsed_params = params_parser(json);
    this.params = parsed_params;
    return this;
  },


  render_template: function(){
    if(!this.in_sight){return;}
    var template = JST[this.template];
    if(!template){throw new Error('Undefined template: ' + this.template);}
    return template(this.context);
  },


  render_items: function(items, el, ViewItem){
    items || (items = this.collection.models);
    var ViewKlass = ViewItem || this.ViewItem;
    var $el = $(el || this.view_items_el && this.$(this.view_items_el) ||  this.$el);
    // console.log('RENDER ITEMS', $el);
    console.groupCollapsed('RENDER: inner items');
    $el.html(_.map(items, function(item){
      return new ViewKlass({model: item, parent: this}).render().el;
    }, this));
    console.groupEnd('RENDER: inner items');
  }
},{
  remove_views_in_element: function(element){
    var view;
    $(element).find('[data-view]').each(function(){
      view = $(this).data('_view');
      view && view.remove();
    });
  }
});
