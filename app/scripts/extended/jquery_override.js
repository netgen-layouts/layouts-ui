define(['jquery'], function($){
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

});
