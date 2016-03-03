define(['underscore', 'view', './tree_item'], function(_, View, TreeItem){
  'use strict';

  return View.extend({
    extend_with: ['browser'],
    ViewItem: TreeItem,
    prevent_auto_render: true,

    click_item_by_id: function(id){
      var $item = $('.tree li[data-id="' + id + '"] a');
      console.log(id, $item);
      if($item.length === 0){ return false; }
      $item.trigger('click');
      $item.parents('li').addClass('open');
      $item.addClass('open');
      return  this;
    }

  });

});
