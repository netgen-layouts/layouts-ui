define(['underscore'], function(_){
  'use strict';

  function Pager(options){
    _.extend(this, options || {});
    this.total = parseInt(this.total, 10);
    this.limit = parseInt(this.limit, 10);
    this.calculate();
  }

  Pager.prototype.calculate = function(){
    var rest = this.total % this.limit;
    var total_pages = parseInt(this.total / this.limit, 10);
    this.total_pages  = rest === 0 ? total_pages : total_pages + 1;

    if(typeof(this.current_page) !== 'undefined' && this.current_page !== null){
      this.current_page   = parseInt(this.current_page, 10);
      this.current_offset = this.page(this.current_page).offset;
    }
    else if(typeof(this.current_offset) !== 'undefined' && this.current_offset !== null){
      this.current_offset = parseInt(this.current_offset, 10);
      this.current_page   = (this.current_offset / this.limit) + 1;
    }else{
      throw('Must provide current_page or current_offset');
    }


    this.total_offset = this.total_pages * this.limit;

    this.next_page = this.current_page + 1;
    this.next_page = this.next_page <= this.total_pages ? this.next_page : null;

    this.prev_page = this.current_page - 1;
    this.prev_page = this.prev_page >= 1 ? this.prev_page : null;

    this.prev = this.prev_page ? this.page(this.prev_page) : this.prev_page;
    this.next = this.next_page ? this.page(this.next_page) : this.next_page;
  };


  Pager.prototype.page = function(num) {
    return {
      offset: (parseInt(num, 10) - 1) * this.limit
    };
  };


  Pager.prototype.render = function() {
    var inner_window = 3;
    var outer_window = 1;
    var current_page = this.current_page;
    var total_pages = this.total_pages;


    var gap = '...', left, middle, right;
    var window_from = current_page - inner_window;
    var window_to = current_page + inner_window;

    // adjust lower or upper limit if other is out of bounds
    if(window_to > total_pages){
      window_from -= window_to - total_pages;
      window_to = total_pages;
    }

    if(window_from < 1){
      window_to += 1 - window_from;
      window_from = 1;
      if(window_to > total_pages){window_to = total_pages;}
    }

    // these are always visible
    middle = _.range(window_from, window_to+1);

    // left window
    if(outer_window + 3 < middle[0]){ // there's a gap
      left = _.range(1,(outer_window + 2));
      left.push(gap);
    }else{ // runs into visible pages
      left = _.range(1, middle[0] || 0);
    }

    // right window
    if(total_pages - outer_window - 2 > _.last(middle)){ // again, gap
      right = _.range((total_pages - outer_window), total_pages+1);
      right.unshift(gap);
    }else{ // runs into visible pages
      right = _.range((_.last(middle) || 0)+1, total_pages+1);
    }


    var pages = [].concat(left, middle, right);
    return _.map(pages, function(item){
      return {page: item, gap: item === '...'};
    });

  };


  return Pager;

});
