define([], function(){
  'use strict';

  return  {

    parents: function(){
      var cat;
      if(this.__parents){return this.__parents;}
      this.collection.each(function(category){
        cat = category;
        category.__parents || (category.__parents = []);
        while(cat.get('parent')){
          category.__parents.unshift(cat.get('parent'));
          cat = cat.get('parent');
        }
      });

      return this.__parents;
    },


    children: function(){
      return this.__children || (this.__children = this.collection.where({parent_id: this.get('id')}));
    },

    has_children: function(){
      return this.get('children').length;
    },


    root: function(){
      return this.__root || (this.__root = this.get('parents')[0]);
    },

    root_or_self: function(){
      return this.get('root') || this;
    },


    is_root: function(){
      return !this.get('root');
    },


    parent_or_self: function(){
      return this.get('parent') || this;
    },

    parent: function(){
      return this.__parent || (this.__parent = this.collection.get(this.get('parent_id')));
    },

    siblings: function(){
      return this.__siblings || (this.__siblings = this.collection.where({parent_id: this.get('parent_id')}));
    },

    self_and_siblings: function(){
      return [this].concat(this.siblings());
    },

    depth: function(){
      return this.__depth || (this.__depth = this.get('parents').length);
    }
  
  };
  

});