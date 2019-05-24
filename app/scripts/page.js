'use strict';

var _ = require('underscore');
var Core = require('./core');
var $ = Core.$;
var App = Core;
var View = Core.View;
var master_views = require('./views/masters/main');



function Page(){
  this.master || (this.master = Page.default_master);
  this.g = {};
}

Page.default_master = 'application';
Page.last_master = null;
Page.master_view = null;


Page.init = function(){
  var instance = new this();
  return _.bind(instance.init, instance);
};


Page.extend = View.extend; //copy backbone extend functionality


Page.prototype.init = function() {
  App.trigger('page:init', this);
  var args = [this._init, this].concat(_.toArray(arguments));
  this.deps(_.bind.apply(_, args));
};

Page.prototype._init = function() {
  var setup = this.setup.apply(this, arguments);

  setup !== false && this.render().main.apply(this, arguments);
  console.warn('========================================>', this.name || this.layout || this.master);
  App.trigger('current_page', this.name || this.layout || this.master);
};

Page.prototype.set_id = function(id) {
  id = 'page-'+id;
  document.body.id = id;
  return id;
};


Page.prototype.deps = function(done) {
  done();
};


Page.prototype.remove_old_views = function(inner_only){
  var scope = inner_only ? 'yield' : 'view';
  var views = $('[data-'+scope+'] [data-view]').map(function(){
    return $(this).data('_view');
  }).get();
  _.each(views, function(view){
    view.remove();
  });
  return this;
};

Page.prototype.setup = function() {
  this.child_view = new View({
    template: 'pages/' + this.layout
  });
  return true;
};

Page.prototype.render = function(){
  this.remove_old_views(true);

  if(Page.last_master !== this.master){
    this.remove_old_views();
    this.master_view = Page.master_view = new master_views[this.master]();
    this.master_view.page = this;
    Page.master_view.render();
  }
  this.child_view.page = this;
  Page.master_view.yield(this.child_view);

  Page.last_master = this.master;
  return this;
};

module.exports = Page;
