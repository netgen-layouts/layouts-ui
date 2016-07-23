'use strict';

function master_slave_selects(master_select, opts){
  opts || (opts = {});
  var
    $this = $(master_select),
    master_value = $this.val(),
    $parent = $this.closest('.master-slave-selects'),
    $slave = $parent.find('.slave')

    $this.addClass('js-skip-on-change');

    $('option', $slave).each(function(){
      var $this = $(this);
      var master_list = $this.data('master').split(',');
      var includes = $.inArray(master_value, master_list) !== -1;
      $this[includes ? 'removeClass' : 'addClass']('hidden');
    });

    var $first = $('option:not(.hidden):first', $slave);

    if($first.is(':selected')){return;}
    $first.prop('selected', true).trigger('change');

    $slave.on('transitionend', function() {
      $slave.removeClass('highlight');
    })

    opts.change && $slave.addClass('highlight');


    // $parent.find('[data-linked-value]').hide();
    // $parent.find('[data-linked-value="'+val+'"]').show();
}


$(document).on('change', '.master-slave-selects .master', function(e){
  master_slave_selects(this, {change: true});
});


$.fn.master_slave_selects = function(){
  $(this).each(function(){
    master_slave_selects(this);
  });
};
