'use strict';

var Core = require('../../core');
var $ = Core.$;

function view_types(master_select, opts){
  opts || (opts = {});
  var
    $this = $(master_select),
    $slaves = $this.parents('form').find('[data-view-type]'),
    master_value = $this.val();

    $this.addClass('js-skip-on-change');

    $slaves.each(function(){
      var $this = $(this);
      var master_list = $this.data('viewType').split(',');
      var includes = $.inArray(master_value, master_list) !== -1;
      var $real_parent = $this.closest('.row-input');
      $real_parent = $real_parent.length ? $real_parent : $this.parent();
      $real_parent[includes ? 'show' : 'hide'](400);
    });

}


$(document).on('change', '.view-type', function(e){
  view_types(this, {change: true});
});


$.fn.view_types = function(){
  $(this).each(function(){
    view_types(this);
  });
};
