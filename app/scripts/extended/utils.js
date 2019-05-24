'use strict';

module.exports = {
  interpolate: function (s,d){
   for(var p in d){
    if(d[p]){
      s=s.replace(new RegExp(':'+p,'g'), d[p]);
    }
   }
   return s;
  },

  clean_route: function(route) {
    return route.replace(/\(|\)/g, '').replace(/\/\:\w+/g, '').replace(/\/(?:null|undefined)/g, ''); // TODO: test this line
  },

  pluralize: function(str, count){
    var out = str;
    if(count > 1){out += 's';}
    return out;
  }
};
