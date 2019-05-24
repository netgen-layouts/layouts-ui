'use strict';

var _ = require('underscore');
var Handlebars = require('handlebars');

var Builders = {};

/**
 * Helper object for generating HTML tags
 * @class TagHelper
 * @static
 * @type {Object}
 */
var TagHelper = {
  /**
   * Mark string as safe. Wont escape parameters found in string &lt;str&gt;
   * Depends on Handlebars templating library.
   * Handlebars SafeString function wrapper.
   *
   * @example
   * ```
   * safe('This tag will be treated as HTML: <br>');
   * => 'This tag will be treated as HTML: <br>'
   * ```
   *
   * @method safe
   * @param  {String} str
   * @return {String}
   */
  safe: function(str){
    return new Handlebars.SafeString(str);
  },


  /**
   * Always treat input parameter &lt;str&gt; as string. Escape HTML found in &lt;str&gt;.
   * Depends on Handlebars templating library.
   * Handlebars Utils.escapeExpression function wrapper.
   *
   * @example
   * ```
   * escape('This tag wont be treated as HTML: <br>');
   * => 'This tag wont be treated as HTML: &lt;br&gt;'
   * ```
   *
   * @method escape
   * @param  {String} str
   * @return {String}
   */
  escape: function(str){
    return Handlebars.Utils.escapeExpression(str);
  },


  /**
   * Renders JST['template_name'] with given &lt;context&gt;. JST is global container for templates.
   * Returns HTML string.
   *
   * @example
   * ```
   * render_partial('template_name', { &lt;context&gt; → object containing variables/objects to be displayed on template });
   * => '<div>Rendered template returned as HTML string.</div>'
   * ```
   *
   * @method render_partial
   * @param  {String} template
   * @param  {Object} context
   * @return {String}
   */
  render_partial: function(template, context){
    return TagHelper.safe(JST[template](context));
  },


  /**
   * Generates HTML attributes string from &lt;options&gt; object.
   *
   * @example
   * ```
   * html_options({id: 'element_1', name: 'example_name'})
   * => 'id="element_1" name="example_name"'
   * ```
   *
   * @method html_options
   * @param  {Object} options
   * @return {String}
   */
  html_options: function(options) {
    var html_options, key, value;
    if (options === null) {
      options = {};
    }
    this.setup_options(options);
    html_options = [];
    for (key in options) {
      value = options[key];
      if (value !== null) {
        html_options.push(' ' + key + '=\"' + value + '\"');
      }
    }
    return html_options.join('');
  },


  /**
   * In &lt;options&gt; object search for attributes: 'disabled', 'checked', 'selected', 'multiple'.
   * If attribute value equals true, replace it with attribute name.
   * Else, delete found option (if undefined, false or null)
   *
   * @example
   * ```
   * setup_options({ disabled: 'disabled', checked: true, selected: false });
   * => {disabled: 'disabled', checked: 'checked'}
   * ```
   *
   * @method setup_options
   * @param  {Object} options
   * @return {Object}
   */
  setup_options: function(options) {
    if(!options) { return; }
    var option, _i, _len, _ref;
    _ref = ['disabled', 'checked', 'selected', 'multiple', 'readonly'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      if (options[option] === true || options[option] === option) {
        options[option] = option;
      } else {
        delete options[option];
      }
    }
    return options;
  },


  /**
   * For given &lt;tag&gt; string (e.g. 'br') create HTML string.
   * Set tag HTML attributes from &lt;options&gt; object using this.html_options().
   * Parameter &lt;open&gt; is used to modify closing tag (true: '>', false: '/>').
   * Returns HTML string.
   *
   * @example
   * ```
   * tag('br', {id: "example_id"});
   * => '<br id="example_id" />';
   * ```
   *
   * @method tag
   * @param  {String} tag
   * @param  {Object} options
   * @param  {Boolean} open
   * @return {String}
   */
  tag: function(tag, options, open) {
    var tag_close;
    if (options === null) {
      options = {};
    }
    tag_close = open ? '>' : ' />';
    return '<' + tag + (this.html_options(options)) + tag_close;
  },


  /**
   * For given &lt;tag&gt; (e.g. 'div') create HTML string with &lt;content&gt; as inner HTML.
   * Set tag HTML attributes from &lt;options&gt; object using this.html_options().
   *
   * @example
   * ```
   * content_tag('div', 'Element contents, often HTML string.', { id: "example_id"});
   * => '<div id="example_id">Element contents, often HTML string.</div>'
   * ```
   *
   * @method content_tag
   * @param  {String} tag
   * @param  {String} content
   * @param  {Object} options
   * @return {String}
   */
  content_tag: function(tag, content, options) {
    if (options === null) { // TODO / FIX: Application breaks if == replaced with ===
      options = {};
    }
    return '<' + tag + (this.html_options(options)) + '>' + (content || '') + '</' + tag + '>';
  }
}; // END OF TagHelper



/**
 * Helper object for generating HTML form tags. Extends TagHelper object.
 * @class FormTagHelper
 * @static
 * @type {Object}
 */
var FormTagHelper = {
  /**
   * Generates HTML form tag with HTML options from &lt;options&gt; object.
   * TODO: Improve description. Describe block paramater usage!
   *
   * @example
   * ```
   * TODO !
   * ```
   *
   * @method form_tag
   * @param  {Object} options
   * @param  {Function} block
   * @return {String}
   */
  form_tag: function(options, block) {
    var form_opening_tag, output;
    if (options === null) {
      options = {};
    }
    if (_.isFunction(options)) {
      block = options;
      options = {};
    }
    form_opening_tag = this.tag('form', _.extend({
      action: '#'
    }, options), true);
    if (block != null) { // NOTE: Application breaks if != replaced with !==
      output = [form_opening_tag];
      output.push(block.call(this));
      output.push('</form>');
      return this.safe(output.join(''));
    }
    return form_opening_tag;
  }
}; // END OF FormTagHelper



_.extend(FormTagHelper, TagHelper);


/**
 * HTML form manipulation helper object. Extends FormTagHelper object.
 *
 * @class FormHelper
 * @static
 * @type {Object}
 */
var FormHelper = {
  special_options: ['as', 'for', 'collection', 'label', 'editable',  'uneditable', 'option:name',  'option:id', 'prompt', 'choice', 'dates', 'scope'],

  /**
   * Returns string containing &lt;name&gt; of selected option(model) from given &lt;collection&gt;.
   * Function searches for model in collection where options.selected === model.id;
   *
   * @example
   * ```
   * items = [{classId: 1, title: 'Item1'}, {classId: 2, title: 'Item2'}];
   * selected_option_from_collection_for_select(items, {selected: 2, name: 'title', id: 'classId'});
   * => 'Item2'
   * ```
   *
   * @method selected_option_from_collection_for_select
   * @param  {Array} collection
   * @param  {Object|Array} options
   * @return {String}
   */
  selected_option_from_collection_for_select: function(collection, options){
    var id, name;
    options.id || (options.id = 'id');
    options.name || (options.name = 'name');
    var selected = _.find(collection, function(item){
      id =  item.get ? item.get(options.id) : item[options.id];
      name =  item.get ? item.get(options.name) : item[options.name];

      if(options.dates) {
        return id && options.selected && moment(options.selected).isSame(id, options.scope);
      }else{
        return String(options.selected) === String(id);
      }
    }, this);
    return selected ? name : '';
  },


  /**
   * Returns HTML string perpared as HTML select options. Options are fetched from collection.
   * Attributes passed in &lt;options&gt; define which option will be "selected" and what values will
   * options display (selected: model_id, name: 'name of attribute whose value will be displayed').
   *
   * @example
   * ```
   * options_from_collection_for_select(<collection>, {selected: 6, name: 'number'}))
   * => '<option value="1">213213432</option><option selected="selected" value="6">1915732890</option>'
   * ```
   *
   * @method options_from_collection_for_select
   * @param  {Object} collection
   * @param  {Object|Array} options
   * @return {String}
   */
  options_from_collection_for_select: function(collection, options){
    var id, selected, disabled, name;
    options.id || (options.id = 'id');
    options.name || (options.name = 'name');
    options.disabled && (options.disabled = _.map(options.disabled, function(item){ return String(item); }));

    var content = _.map(collection, function(item){
      id =  item.get ? item.get(options.id) : item[options.id];
      name =  item.get ? item.get(options.name) : item[options.name];

      if(options.dates){
        selected = id && options.selected && moment(options.selected).isSame(id, options.scope);
      }else{
        selected = String(options.selected) === String(id);
        options.disabled && (disabled = _.contains(options.disabled, String(id)));
      }

      return this.content_tag('option', name, {
        selected: selected,
        disabled: disabled,
        value: id
      });
    }, this).join('');
    return content;
  },


  /**
   * Generate HTML &lt;input&gt; tag. &lt;attribute&gt; parameter defines tag name.
   * Parameter object &lt;options&gt; defines input type and model associated with input.
   * Possible types: checkbox, checkbox_choice, checkbox_collection, radio, select, textarea and date.
   *
   * ####Example 1 (text):
   * ```
   *     {{input 'title' value='10'}}
   * ```
   * #####Result 1 (text):
   * ```
   *     <input type='text' value='10' name='title'>
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 2 (text):
   * ```
   *     var context: {
   *       user = { username: 'john23'}
   *     }
   *     {{input 'username' for=user}}
   * ```
   * ####Result 2 (text):
   * ```
   *     <input type='text' value='john23' name='username'>
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 3 (checkbox):
   * ```
   *     {{input 'check_me' as='checkbox' value='some value'}}
   * ```
   * ####Result 3 (checkbox):
   * ```
   *     <input value='0' name='check_me' type='hidden' /><input type='checkbox' value='1' name='checkbox_test' checked='checked' />
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 4 (checkbox_choice):
   * ```
   *     {{input 'i_am_chosen' as='checkbox_collection' value='2' choice='2'}}
   * ```
   * ####Result 4 (checkbox_choice):
   * ```
   *     <input type='checkbox' value='2' name='i_am_chosen' checked='checked' />
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 5 (checkbox_choice):
   * ```
   *     {{input 'i_am_not_chosen' as='checkbox_collection' value='5' choice: 2}}
   * ```
   * ####Result 5 (checkbox_choice):
   * ```
   *     <input type='checkbox' value='5' name='i_am_not_chosen'/>
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 6 (checkbox_collection):
   * ```
   *     context: {
   *       collection: [34, 57, 12]
   *     }
   *
   *     {{input 'bunch_of_checkboxes' as='checkbox_collection' value='12' for=collection}}
   * ```
   * ####Result 6 (checkbox_collection):
   * ```
   *     <input type='checkbox' value='12' name='bunch_of_checkboxes' checked='checked' />
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 7 (radio):
   * ```
   *     {{input 'warp_activated' as='radio' value='2' choice='2'}}
   * ```
   * ####Result 7 (radio):
   * ```
   *     <input type="radio" value="2" name="warp_activated" checked="checked" />
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 8 (select):
   * ```
   *     {{input 'choose_between_0_options' as='select' prompt='true'}}
   * ```
   * ####Result 8 (select):
   * ```
   *     <select type="select" name="choose_between_0_options"><option></option></select>
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 9 (select):
   * ```
   *     {{input 'cant_touch_dis' as='select' prompt='true' editable='false'}}
   * ```
   * ####Result 9 (select):
   * ```
   *     <span class="uneditable-input"></span>
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 10 (select):
   * ```
   *     context: {
   *       some_object: {
   *         some_input: 'Input value',
   *         type_id: 2
   *       },
   *       types: [
   *         {id: 1, name: 'Type 1'},
   *         {id: 2, name: 'Type 2'},
   *         {id: 3, name: 'Type 3'}
   *       ]
   *     }
   *
   *     {{#form_for some_object name='test'}}
   *       {{input 'type_id' as='select' collection=../types}}
   *     {{/form_for}}
   * ```
   * ####Result 10 (select):
   * ```
   *     <form action='#' name='test'>
   *       <select type='select' name='test[type_id]'>
   *         <option value='1'>Type 1</option>
   *         <option selected='selected' value='2'>Type 2</option>
   *         <option value='3'>Type 3</option>
   *       </select>
   *     </form>
   * ```
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 11 (textarea):
   * ```
   *     {{input 'lots_of_writing_field' as='textarea'}}
   * ```
   * ####Result 11 (textarea):
   *     <textarea type="textarea" value="" name="lots_of_writing_field"></textarea>
   *
   *
   * ### ------------------------------------------------------------------------------------------------
   *
   *
   *
   * ####Example 12 (date):
   * ```
   *     {{input 'birthday' as='date' value='2013-11-05T00:00:00.000'}}
   * ```
   * ####Result 12 (date):
   * ```
   *     <input type="date" value="2013-11-05" name="birthday" />
   * ```
   *
   * @method input
   * @param  {String} attribute
   * @param  {Object} options
   * @return {String}
   */
  input: function(attribute, options){
    var type = options.as || 'text',
        model = options.for,
        name = attribute,
        value = options.value;

    if(model){
      value = model.get ? model.get(attribute) : model[attribute];
    }

    //TODO: check escape functionality which was moved to html_options
    //value = _.isUndefined(value) ? '' : this.escape(_.isFunction(value) ? value() : value);
    value = _.isUndefined(value) ? '' : _.isFunction(value) ? value() : value;

    // translate attribute
    for(var opt in options) {
      if(options[opt] && _.isString(options[opt]) && options[opt].indexOf('t.') === 0 ){
        options[opt] = options[opt].replace('t.', '');
      }
    }

    var html_options = _.extend({
      type: type,
      value: this.escape(value),
      name: name
    }, _.omit(options, this.special_options));

    var uneditable_text;

    var data_id_prefix = html_options['data-id-prefix'] || '';

    if(_.result(options,'uneditable') === true || !_.isUndefined(options.editable) && _.result(options,'editable') !== true){
      html_options['class'] || (html_options['class'] = '');
      html_options['class'] += ' uneditable-input';

      if(options.as === 'select') {
        uneditable_text = this.selected_option_from_collection_for_select(options.collection, {name: options['option:name'], id: data_id_prefix + options['option:id'], selected: value, dates: options.dates, scope: options.scope, disabled: options.disabled});
      }else{
        uneditable_text = html_options.value;
      }
      return this.safe(this.content_tag('span', uneditable_text,  _.omit(html_options, 'type', 'name', 'value')));
    }


    if(data_id_prefix){
      html_options.id = data_id_prefix + html_options.id;
    }
    delete html_options['data-id-prefix'];

    switch(options.as) {
      case 'checkbox':
        html_options.value = 1;
        if(value){html_options.checked = 'checked';}
        var hidden = this.tag('input', {value: 0, name: html_options.name, type: 'hidden'});
        return this.safe(hidden + this.tag('input', html_options));

      case 'checkbox_choice':
        html_options.type = 'checkbox';
        if(value === options.choice){
          html_options.checked = 'checked';
        }
        html_options.value = options.choice;
        return this.safe(this.tag('input', html_options));

      case 'checkbox_collection':
        html_options.type = 'checkbox';
        if(!(options.collection && options.collection.length)){
          html_options.checked = 'checked';
        }else if(_.contains(options.collection, value)){
          html_options.checked = 'checked';
        }
        return this.safe(this.tag('input', html_options));

      case 'checkbox_collection2':
        html_options.type = 'checkbox';
        html_options.value = options.choice;
        if(_.contains(value, parseInt(options.choice, 10) )){
          html_options.checked = 'checked';
        }
        return this.safe(this.tag('input', html_options));

      case 'checkbox_collection3':
        html_options.type = 'checkbox';
        if(_.contains(options.collection, value)){
          html_options.checked = 'checked';
        }
        return this.safe(this.tag('input', html_options));

      case 'radio':
        if(value === options.choice){html_options.checked = 'checked';}
        html_options.value = options.choice;
        return this.safe(this.tag('input', html_options));

      case 'select':
        delete(html_options.value);
        var select_options = '';
        options.prompt && (select_options += this.content_tag('option', ''));
        select_options += this.options_from_collection_for_select(options.collection, {name: options['option:name'], id: options['option:id'], selected: value, dates: options.dates, scope: options.scope, disabled: options.disabled});
        return this.safe(this.content_tag('select', select_options, html_options));

      case 'textarea':
        return this.safe(this.content_tag('textarea', value, html_options));

      case 'date':
        html_options.value = (value ? moment(value).format('YYYY-MM-DD') : '');
        _.isArray(html_options.value) && (html_options.value = html_options.value.toString()); //OPTIMIZE: SAME CODE
        return this.safe(this.tag('input', html_options));

      default:
        _.isArray(html_options.value) && (html_options.value = html_options.value.toString());  //OPTIMIZE: SAME CODE
        return this.safe(this.tag('input', html_options));
    }
  },


  /**
   * form_for is block function. Creates HTML form binded to object. Form fields / inputs can be connected to object attributes.
   *
   * @example
   * ```
   * // Template context:
   * var context = {
   *  model: {
   *    title: 'My transaction',
   *    amount: 1500
   *  }
   * }
   *
   * // Template:
   * {{#form_for model name="transaction"}}
   *   {{input 'title'}}
   *   {{input 'amount'}}
   * {{/form_for}}
   * ```
   * ##### Result:
   * ```
   * <form>
   *   <input type="text" name="transaction[title]" value="My transaction" />
   *   <input type="text" name="transaction[amount]" value="1500" />
   * </form>
   * ```
   *
   * @method form_for
   * @param  {Object|Model} object
   * @param  {Object} form_options
   * @param  {Function} block
   * @return {String}
   */
  form_for: function(object, form_options, block) {
    var output;
    form_options.builder || (form_options.builder = Builders.default);
    output = [this.form_tag(_.omit(form_options, 'builder'))];
    output.push(this.fields_for.call(this, object, form_options, block));
    output.push('</form>');
    return this.safe(output.join(''));
  },


  /**
   * fields_for is block function. Creates "sub context" that enables us to display/render attributes
   * from binded &lt;object&gt; to part of template inside {{#fields_for}} ... {{/fields_for}} tags.
   * Returns compiled template string (HTML string).
   *
   * @example
   * ```
   * // Template context:
   * var context = {
   *   user: {
   *     name: 'Mirko',
   *     age: 20
   * }
   *
   * // Template:
   * {{#fields_for user name="user"}}
   *   {{input 'name'}}
   *   {{input 'age'}}
   * {{/fields_for}}
   * ```
   * ##### Result:
   * ```
   * '<input type="text" value="Mirko" name="user[name]" /> <input type="text" value="20" name="user[age]" />'
   * ```
   *
   * @method fields_for
   * @param  {[Object]}   object
   * @param  {[Object]}   options
   * @param  {[Function]}   block
   * @return {[String]}
   */
  fields_for: function(object, options, block) {
    var Builder, builder_instance;
    Builder = options.builder && Builders[options.builder] || Builders.default;
    builder_instance = new Builder(options.name, object, this, options, block);
    return block.call(this, builder_instance);
  },

  /**
   * Returns string to be set as &lt;name&gt; attribute of HTML tag. Name is taken from &lt;object&gt; attribute &lt;class_name&gt;
   * Name format is: "object_name[attribute_name]"
   *
   * @method setup_name
   * @param  {[Object]}   object
   * @param  {[String]}   attribute
   * @return {[String]}
   */
  setup_name: function(object, attribute) {
    var class_name, name;
    class_name = object.constructor && object.constructor.class_name || object.class_name;
    if (!class_name) {
      throw 'Class name is not defined on model!' + (JSON.stringify(object));
    }
    name = class_name + '[' + attribute + ']';
    return name;
  }
}; // END OF FormHelper

_.extend(FormHelper, FormTagHelper);

module.exports = FormHelper;
