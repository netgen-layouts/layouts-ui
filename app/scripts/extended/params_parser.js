'use strict';

module.exports = function(params){
  var parsed_params = {}, k, last_params, m;

  for(k in params){
    last_params = parsed_params;
    m = k.match(/(\w+)(\[(\w+)]\])*/g);
    do{
      if(m.length > 1){
        last_params = last_params[m[0]] = last_params[m[0]] || {};
      }else{
        last_params[m[0]] = params[k];
      }
      m.shift();
    }while(m.length);

  }

  return parsed_params;
};
