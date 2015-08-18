define(['underscore', 'model',  'app'], function(_, Model, App){
  'use strict';

  return Model.extend({

    format: 'json',

    initialize: function(){
      Model.prototype.initialize.apply(this, arguments);
      this.on('save:success', this.after_save);
      return this;
    },

    after_save: function(model){
      if(!model.group){return;}

      console.log("SAVE SUCCESS", this, arguments);
      var p = JSON.parse(model.group.get('params') || "{}");
      console.debug(p);
      p[model.get('label')] = model.id;
      console.debug(p);

      model.group.save({params: JSON.stringify(p) });
      return this;
    },

    type: function(){
      return App.g.block_templates.get(this.get('template_id'));
    },

    template: function(){
      return this.type();
    },

    type_name: function(){
      return this.type().get('type');
    },

    html_url: function(){
      console.log(this.attributes, this.urlRoot);
      var params = $.param({block: this.attributes});
      if(this.isNew()){
        return this.urlRoot + '/' + 'dummy?ajax=true&'+params;
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
