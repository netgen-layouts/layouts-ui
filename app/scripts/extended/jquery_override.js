'use strict';

var $ = require('jquery');
window.ngc_jquery = window.jQuery = $;
require('bootstrap/js/transition');
require('bootstrap/js/dropdown');
require('bootstrap/js/modal');
require('bootstrap/js/collapse');
require('jquery-ui/sortable');
require('jquery-ui/draggable');
require('jquery-ui/droppable');


jQuery.noConflict(true);


$.fn.toJSON = function() {
  var hash = {};
  $.each(this.serializeArray(), function() {
    if (this.name.indexOf('[]') !== -1) {
      var key = this.name.replace('[]', '');
      hash[key] = hash[key] || [];
      hash[key].push(this.value);
    } else {
      hash[this.name] = this.value;
    }
  });
  return hash;
};


function clean_backbone_views(el){
  var view;
  $(el).find('[data-view]').each(function(){
    view = $(this).data('_view');
    view && view.remove();
  });
}

var html = $.fn.html;
$.fn.html = function(){
  clean_backbone_views(this);
  return html.apply(this, arguments);
};

var text = $.fn.text;
$.fn.text = function(){
  clean_backbone_views(this);
  return text.apply(this, arguments);
};

$.fn.read_data_and_remove_key = function(name){
  var $this = $(this);
  var val = $this.data(name);
  $this.removeData(name);
  return val;
};


$.fn.ajax_submit = function (opts) {
  opts || (opts = {});
  var $this = $(this);
  return $.ajax({
    url: $this.attr('action'),
    method: $this.attr('method'),
    data: $this.serialize(),
    beforeSend: opts.beforeSend,
  });
};



$.fn.closest_view = function () {
  return $(this).closest('[data-view]').data('_view');
};


$.fn.browser_tabs = function (options) {
  options || (options = {});
  var $this = $(this),
      $control = $this.children('ul');

  $this.find('.tab-pane').hide();
  if (options.active_tab){
    $control.find('#' + options.active_tab).closest('li').addClass('active');
    $this.find('#' + options.active_tab + '-tab').show();
  } else {
    $control.find('li:first').addClass('active');
    $this.find('.tab-pane:first').show();
  }

  $control.find('li a').click(function(e){
    e.preventDefault();

    var $id = $(this);
    var name = $id.attr('id');

    // tab
    $control.find('li').removeClass('active');
    $id.closest('li').addClass('active');

    // tab content
    $this.find('.tab-pane').hide();
    $this.find('#'+ name + '-tab').show();
  });
};


$(document)
  .on('click', '.xeditable .js-edit', function(e){
    e.preventDefault();
    var $this = $(this),
        $xeditable = $this.closest('.xeditable'),
        $form = $xeditable.find('.form'),
        view = $this.closest_view(),
        form_html = $form.data('original_html');
        $xeditable.find('.current').hide();
        view.$el.addClass('xeditable-active');
        $form.html(form_html);
        view && view.trigger_with_global('plugins:reinitialize');

  }).on('click', '.xeditable .js-cancel', function(e){
    e.preventDefault();
    var $this = $(this),
        view = $this.closest_view(),
        $xeditable = $this.closest('.xeditable');
        view.$el.removeClass('xeditable-active');
        $xeditable.find('.form').empty();
        $xeditable.find('.current').show();

  }).on('click', '.xeditable .js-apply', function(e){
    e.preventDefault();
    var $this = $(this),
        $xeditable = $this.closest('.xeditable'),
        name = $xeditable.data('xeditableName'),
        view = $this.closest_view();
        view.$el.removeClass('xeditable-active');
        view && view.trigger('xeditable:apply:'+name);

  }).on('shown.bs.dropdown', '.dropdown', function () {
    var $ul = $(this).children('.dropdown-menu');
    var $button = $(this).children('.dropdown-toggle');
    var ulOffset = $ul.offset();
    var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();
    var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());
    if (spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown)) {
      $(this).addClass('dropup');
    }

  }).on('hidden.bs.dropdown', '.dropdown', function () {
    $(this).removeClass('dropup');
});



$.fn.xeditable = function(){


  return $(this).each(function(){
    var $this = $(this),
        $form = $this.find('.form');

    $this.attr('data-input', '');

    if($form.data('original_html')) {return;}
    var form_html = $form.html();
    $form.data('original_html', form_html);

    $form.empty();

  });
};



function dependable_select_detect(master_select, opts){
  opts = $.extend({
    animate: true,
  }, opts || {});

  var $this = $(master_select);
  $this = $this.is('select') ? $this : $this.find('select:first');

  var
    val = $this.val(),
    animate = opts.animate,
    $parent = $this.closest('.js-dependable-selects-group');

    $parent.find('[data-linked-value]').hide(animate && 400);
    $parent.find('[data-linked-value="'+val+'"]').show(animate && 400);
}


$(document).on('change', '.js-dependable-selects-group .js-master', function(){
  dependable_select_detect(this);
});


$.fn.dependable_select = function(){
  $(this).each(function(){
    dependable_select_detect(this, {animate: false});
  });
};

module.exports = $;
