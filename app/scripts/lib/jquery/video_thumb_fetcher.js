'use strict';

var Core = require('../../core');
var $ = Core.$;

$.fn.video_thumb_fetcher = function(){
  return $(this).each(function() {
    var id = $(this).data('video-id'),
        service = $(this).data('service'),
        $thumb = $(this).find('img.js-video-thumb');

    if (service === 'youtube'){
      $thumb.attr('src', 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg?'+(+new Date));
    } else if (service === 'dailymotion'){
      $thumb.attr('src', 'https://www.dailymotion.com/thumbnail/video/' + id + '?'+(+new Date));
    } else if (service === 'vimeo'){
      $.ajax({
        type:'GET',
        url: 'https://vimeo.com/api/v2/video/' + id + '.json',
        dataType: 'json',
        success: function(data){
          $thumb.attr('src', data[0].thumbnail_large);
        }
      });
    }
  });
};
