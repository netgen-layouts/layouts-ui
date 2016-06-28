'use strict';

var Block = require('./block');

module.exports = Block.extend({
/*
  render: function(){
    Block.prototype.render.apply(this, arguments);
    this.$thumbDiv = this.$('.external-video-block'),
    this.render2();
    return this;
  },

  render2: function(){
    if(this.model.get('parameters').video_id){
      this.getThumb();
    } else {
      this.$thumbDiv.html('<p>No video placed inside this block</p>');
    }
  },

  getThumb: function(){
    var id = this.model.get('parameters').video_id;
    var self = this;
    if (this.model.get('parameters').service === 'youtube'){
      self.$thumbDiv.html('<div class="video-thumb"><img src="https://img.youtube.com/vi/' + id + '/mqdefault.jpg" /></div>');
    } else if (this.model.get('parameters').service === 'vimeo') {
      $.ajax({
        type:'GET',
        url: 'https://vimeo.com/api/v2/video/' + id + '.json',
        dataType: 'json',
        success: function(data){
          self.$thumbDiv.html('<div class="video-thumb"><img src=' + data[0].thumbnail_large + ' /></div>');
        }
      });
    }
  }
*/
});
