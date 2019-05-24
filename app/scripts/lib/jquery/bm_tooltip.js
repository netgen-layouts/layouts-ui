'use strict';

var Core = require('../../core');
var $ = Core.$;

function BmTooltip(el){
  this.el = el;
  this.title = el.title;
  this.visible = false;

  this.init();
}

BmTooltip.prototype.init = function(){
  this.el.title = '';
  this.tooltip = document.createElement('div');
  this.tooltip.className = 'ngl-tooltip-title';
  this.tooltip.innerHTML = this.title;

  $(this.el).on('mouseenter', this.showTooltip.bind(this));
  $(this.el).on('mouseleave', this.hideTooltip.bind(this));
}

BmTooltip.prototype.showTooltip = function(){
  if (this.visible || !this.title.length) return;
  this.visible = true;
  document.getElementById('app').appendChild(this.tooltip);
  this.calculatePosition();
}

BmTooltip.prototype.hideTooltip = function(){
  if (!this.visible) return;
  this.visible = false;
  document.getElementById('app').removeChild(this.tooltip);
}

BmTooltip.prototype.calculatePosition = function(){
  var rect = this.el.getBoundingClientRect(),
      ttRect = this.tooltip.getBoundingClientRect();

  /* set left */
  if (rect.left + rect.width/2 > ttRect.width/2 && window.innerWidth - rect.left - rect.width/2 > ttRect.width/2){
    this.x = 'center';
    this.tooltip.style.left = rect.left + rect.width/2 - ttRect.width/2 + 'px';
  } else if (rect.left > ttRect.width){
    this.x = 'left';
    this.tooltip.style.left = rect.left - ttRect.width - 10 + 'px';
  } else {
    this.x = 'right';
    this.tooltip.style.left = rect.left + rect.width + 10 + 'px';
  }

  /* set top */
  if (this.x !== 'center'){
    if (rect.top + rect.height/2 > ttRect.height/2 && window.innerHeight - rect.top - rect.height/2 > ttRect.height/2){
      this.y = 'center';
      this.tooltip.style.top = rect.top + rect.height/2 - ttRect.height/2 + 'px';
    } else if (rect.top > ttRect.height){
      this.y = 'top';
      this.tooltip.style.top = rect.top + rect.height - ttRect.height + 'px';
    } else {
      this.y = 'bottom';
      this.tooltip.style.top = rect.top + 'px';
    }
  } else if (rect.top > ttRect.height){
    this.y = 'top';
    this.tooltip.style.top = rect.top - ttRect.height - 10 + 'px';
  } else {
    this.y = 'bottom';
    this.tooltip.style.top = rect.top + rect.height + 10 + 'px';
  }
  this.tooltip.dataset.x = this.x;
  this.tooltip.dataset.y = this.y;
}

$.fn.bm_tooltip = function(){
  return $(this).each(function(){
    if(!$(this).data('bm_tooltip')){
      var instance = new BmTooltip(this);
      $(this).data('bm_tooltip', instance);
    };
  });
};
