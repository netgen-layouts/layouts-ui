'use strict';
var Core = require('../../core');
var $ = Core.$;

function master_slave_selects(master_select, opts){
  opts || (opts = {});
  var
    $this = $(master_select),
    master_value = $this.val(),
    $parent = $this.closest('.master-slave-selects'),
    $slave = $parent.find('.slave'),
    $slave_current_selected = $('option:selected', $slave);

    $this.addClass('js-skip-on-change');

    $('option', $slave).each(function(){
      var $this = $(this);
      var master_list = $this.data('master').split(',');
      //console.log(master_list, master_value);
      var includes = $.inArray(master_value, master_list) !== -1;
      $this[includes ? 'removeClass' : 'addClass']('hidden');
    });


    var show_slave = $('option:not(.hidden)', $slave).length > 1;

    $slave.parent()[show_slave ? 'show' : 'hide' ](400);

    if(!opts.change){return;}

    var $first = $('option:not(.hidden):first', $slave);
    var $option = $slave_current_selected.is(':not(.hidden)') ? $slave_current_selected : $first;
    var changed = !$option.is($slave_current_selected);

    // console.log(changed);

    $option.prop('selected', true).trigger('change');

    $slave.on('transitionend', function() {
      $slave.removeClass('highlight');
    });

    // show_slave && opts.change && $slave.addClass('highlight');
    show_slave && changed && $slave.addClass('highlight');

}


$(document).on('change', '.master-slave-selects .master', function(e){
  master_slave_selects(this, {change: true});
});


$.fn.master_slave_selects = function(){
  $(this).each(function(){
    master_slave_selects(this);
  });
};
