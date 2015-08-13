define(['underscore', 'model',  'app'], function(_, Model, App){
  'use strict';

  return Model.extend({

    format: 'json',

    template: function(){
      return App.g.block_templates.get(this.get('template_id'));
    },

    html_url: function(){
      if(this.isNew()){
        return this.urlRoot + '/' + '1?ajax=true';
      }else{
        return this.urlRoot + '/' + this.id + '?ajax=true';
      }
    },

    new_or_edit_url: function(){
      if(this.isNew()){
        return this.urlRoot + '/' + 'new?ajax=true';
      }else{
        return this.urlRoot + '/' + this.id +'/edit?ajax=true';
      }
    },

    toString: function(){
      return JSON.stringify(this.toJSON());
    }


  });

});
