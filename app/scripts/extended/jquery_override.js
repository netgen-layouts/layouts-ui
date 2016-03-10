define(['jquery', 'app'], function($, App){
  'use strict';

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
      data: $this.serialize()
    });
  };

  $.fn.tabs = function () {
    var $this = $(this);

    $this.find('li:first').addClass('active');
    $('.tab-pane').hide();
    $('.tab-pane:first').show();

    $this.find('li a').click(function(e){
      e.preventDefault();

      var $id = $(this);
      var name = $id.attr('id');

      // tab
      $this.find('li').removeClass('active');
      $id.closest('li').addClass('active');

      // tab content
      $('.tab-pane').hide();
      $('#'+ name + '-tab').show();
    });
  };

});
