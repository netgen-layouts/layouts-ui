'use strict';


var Core = typeof window !== 'undefined' ? require('./core_base') : require('./core_namespace');
var _ = require('underscore');
var Handlebars = require('handlebars');
var TagHelper = require('./tag_helper');

var moment = require('moment');
require('moment/min/locales.min');

var safe = function(){
  return TagHelper.safe.apply(this, arguments);
};

module.exports = Core.handlebars_helpers = {

  date: function(date, opts){
    return moment(date).locale(navigator.language || 'en-gb').format(opts.hash.format || 'llll');
  },

  log: function(something){
    console.log(something);
  },

  math: function(lvalue, operator, rvalue){
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': lvalue * rvalue,
        '/': lvalue / rvalue,
        '%': lvalue % rvalue,
    }[operator];
  },

  t: function(key){
    return Core.i18n.t(key);
  },

  num_prefix: function(num){
    if(num > 0){return '+';}
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

  option_value: function(value, param) {
    var out = 'value="'+value+'"';
    param == value && (out += ' selected="selected"');
    return safe(out);
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
    var value = this.previous(model, attribute);
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
    _(count).times(function(item){
      buffer += options.fn(item);
    });
    return buffer;
  },

  url_for: function(name, opts){
    return Core.router.url_for(name, opts.hash || {});
  },

  link_to: function(title, route, opts){
    var url = Core.router.url_for(route, opts.hash || {});
    return safe('<a href="'+url+'">'+title+'</a>');
  },

  absolute_url: function(path, opts){
    var hostname;
    if(/localhost|127\.|192\./.test(location.hostname)){
      hostname = '188.252.173.66';
    }
    var host = opts.hash.hostname || hostname || location.hostname || '',
        port = opts.hash.port || location.port;
        port = port ? ':'+port : '';
    var url = [location.protocol, '//', host, port, '/', path].join('');
    return url;
  },

  speed: function(number){
    number = number || 300;
    return number / 1000;
  },

  get: function(model, property_name){
    return model.get(property_name);
  },

  eq: function(val1, val2, options){
    if(val1 === val2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  if_not_empty: function(context, options){
    if(_.isEmpty(context)){
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  },

  uid: function(regenerate, options){
    options && regenerate && (this._last_uid = _.uniqueId('uid_'));
    return this._last_uid;
  },

  input: function(attribute, options){
    return (this.object ? this : TagHelper).input(attribute, options.hash);
  },

  /**
   * Wrapper around TagHelper form_for function to make it usable on templates as Handlebars helper.
   *
   * @method form_for
   * @param  {[type]} object
   * @param  {[type]} options
   * @return {[type]}
   */
  form_for: function(object, options){
    return TagHelper.form_for(object, _.omit(options.hash, 'as'), options.fn);
  },

  /**
   * Wrapper around TagHelper fields_for function to make it usable on templates as Handlebars helper.
   *
   * @method fields_for
   * @param  {[type]}   object
   * @param  {[type]}   options
   * @return {[type]}
   */
  fields_for: function(object, options){
    return TagHelper.fields_for(object, options.hash, options.fn);
  },

  replace: function(find, replace, options) {
    var string = options.fn(this);
    return string.split(find).join(replace);
  },

  ifCond: function(v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
  },

};
