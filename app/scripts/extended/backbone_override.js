define(['underscore', 'backbone_original', 'app'], function(_, Backbone, App){
  'use strict';



;(function(Backbone) {

  // The super method takes two parameters: a method name
  // and an array of arguments to pass to the overridden method.
  // This is to optimize for the common case of passing 'arguments'.
  function _super(methodName, args) {
    // Keep track of how far up the prototype chain we have traversed,
    // in order to handle nested calls to _super.
    this._superCallObjects || (this._superCallObjects = {});
    var currentObject = this._superCallObjects[methodName] || this,
        parentObject  = findSuper(methodName, currentObject);
    this._superCallObjects[methodName] = parentObject;

    var result = parentObject[methodName].apply(this, args || []);
    //delete this._superCallObjects[methodName];
    this._superCallObjects[methodName] = null;
    return result;
  }

  // Find the next object up the prototype chain that has a
  // different implementation of the method.
  function findSuper(methodName, childObject) {
    var object = childObject;
    while (object[methodName] === childObject[methodName]) {
      object = object.constructor.__super__;
    }
    return object;
  }

  _.each(['Model', 'Collection', 'View', 'Router'], function(klass) {
    Backbone[klass].prototype._super = _super;
  });

})(Backbone);


  var sync = Backbone.sync;

  Backbone.sync = function(method, what, options){
    //options.data || (options.data = {});
    Backbone.defaults && _.extend(options, Backbone.defaults() || {});
    Backbone._cacheRequest.apply(this, arguments);

    var via = options.via || method;
    //delete(options.via);

    var xhr = sync(method, what, options)
      .done(function(){
        var save_method = /create|update/.test(via);
        what.trigger(via+':'+'success', what, xhr, options);
        save_method && what.trigger('save:'+'success', what, xhr, options);
      })
      .fail(function(){
        var save_method = /create|update/.test(via);
        what.trigger(via+':'+'error', what, xhr, options);
        save_method && what.trigger('save:'+'error', what, xhr, options);
      });

    return xhr;
  };


  Backbone._cacheRequest = function(method, what, xhr){
    what.request || (what.request = {});
    if(method === 'read'){
      !_.isUndefined(what) && (what.request[method] = xhr.data);
    }
    return this;
  };



  //Router params as object =======================================================================
  var _extractParametersOriginal = Backbone.Router.prototype._extractParameters;


  Backbone.Router.prototype._extractParameters = function(route, fragment, name){
    var args = _extractParametersOriginal.apply(this, arguments);
    this._inverted_routes || (this._inverted_routes = _.invert(this.routes));

    this.params = _.reduce(this._inverted_routes[name].match(/:(\w+)/g), function(memo, m, i){
      memo[m.replace(':', '')] = args[i]; return memo;
    }, {});

    args && args.unshift(this.params);
    return args;
  };

  Backbone.Router.prototype.route = function(route, name, callback) {
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    if (_.isFunction(name)) {
      callback = name;
      name = '';
    }
    if (!callback) callback = this[name];
    var router = this;
    Backbone.history.route(route, function(fragment) {
      var args = router._extractParameters(route, fragment, name); //name is inserted
      router.route_name = name;
      router.trigger.apply(router, ['route:before:' + name].concat(args));
      router.trigger.apply(router, ['route:before', name].concat(args));

      var default_callback = function(){
        router.execute(callback, args, name);
      };

      router.before ? router.before.call(router, name, args[0], default_callback) : default_callback();

      router.trigger.apply(router, ['route:' + name].concat(args));
      router.trigger('route', name, args);
      Backbone.history.trigger('route', router, name, args);
    });
    return this;
  };



  //Router url_for  =======================================================================

  // From prototype 1.7
  var rescape = function(str){return String(str).replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1')};

  Backbone.Router.prototype.url_for = function (name, params, opts){
    params || (params = {});
    opts || (opts = {});


    params.locale = params.locale || this.params.locale || App.default_locale; //TODO: extract

    this._inverted_routes || (this._inverted_routes = _.invert(this.routes));

    var use_hash = Backbone.history._wantsHashChange && !opts.omit_hash;
    var route = (use_hash ? '#' : '') + this._inverted_routes[name],
        reg, query_params = {}, in_url;

    if(params){
      _.each(params, function(v, k){
        in_url = false;
        reg = new RegExp(rescape(':'+k), 'g');
        route = route.replace(reg, function(){
          in_url = true;
          return v;
        });

        if(!in_url && !(v === null || v === undefined)){ query_params[k] = v; }
      });

      !_.isEmpty(query_params) && (route += '?' + $.param(query_params));
    }

    route = route.replace(/\(|\)/g, '').replace(/\/\:\w+/g, '').replace(/\/null/, ''); // TODO: test this line

    return route;
  };

  // ===============================================================================================

  Backbone.Router.prototype.navigate_to = function(name, params, options){
    options = _.extend({
      trigger: true
    }, options);
    return this.navigate(this.url_for(name, params), options);
  };


  //Copy events
  var original_extend  = Backbone.View.extend;
  Backbone.View.extend = function(child) {
    var view = original_extend.apply(this, arguments);
    view.prototype.events = _.extend({}, this.prototype.events, child.events);
    return view;
  };


  Backbone.Events.listenToAll = function(what, events, callback, delay){
    return this.listenTo(what, events, _.debounce(callback, delay || 100));
  };

  Backbone.Events.onAll = function(name, callback, delay, context) {
    return this.on(name, _.debounce(callback, delay || 100), context);
  };


  return Backbone;

});
