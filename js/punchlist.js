;(function ( $, window, document, undefined ) {
  
  var punchList = 'defaultPunchList',
          defaults = {
              title: "Punch-List",
              apiCall: "json/response.json",
              punchListContainerTemplate: ({ title }) => `<div id="punchlist-title">
                <h1><i class="fa fa-check"></i>${title}</h1>
              </div>
              <div id="punchlist-items-container">
                <div id="punchlist-items">          
                </div>
                <div id="add-todo">
                  <i class="fa fa-plus"></i>
                  Add an Item
                </div>        
              </div>`,
              punchListItemTemplate: (item, index) =>  `<div id="item-${index}">
                <div class="punchlist-item">
                  <div class="punchlist-item-label">
                    <input type="checkbox" id="${index}" ${item.index ? 'checked': ''}/>
                    <label for="${index}" class="punchlist-item-label-text" title="${item.item}">
                      <span class="punchlist-item-label-text-line">
                        <span class="punchlist-item-label-text-data">${item.item}</span>
                      </span>
                    </label>
                  </div>
                  <div class="punchlist-item-action" title="comments">
                    <i class="fa fa-comment"></i>
                  </div>
                  <div class="punchlist-item-action" title="remove">
                    <i class="fa fa-times-circle"></i>
                  </div>
                </div>
                <div class="punchlist-item-tags">
                  <div class="punchlist-item-tag">Company: ${item.company}</div>
                  <div class="punchlist-item-tag">Project: ${item.project}</div>
                  <div class="punchlist-item-tag">User: ${item.user}</div>
                </div>
                <div class="comments hidden">
                   ${item.comments.map( comment => `<div class="comment">${comment.comment}<div class="punchlist-comment-tag">User: ${comment.user}</div></div>`).join('')}
                </div>
              </div>
            `,       
            };

  function PunchList( element, options ) {    
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = punchList;
    this._index = 0;
    this._adding = false;
    this.init();
  }          

  PunchList.prototype.init = function() {
    var htmlPunchListContainer = [{title: this.options.title}].map(this.options.punchListContainerTemplate).join('');
    $(this.element).html(htmlPunchListContainer);
    // TODO: Exception management for call 
    var self = this;
    $.getJSON(this.options.apiCall, function(items) { 
      self._index = items.length;
      self.drawItems(items);
    });
    /* Adding Add Behaviour */
    $('#add-todo').click(function(){ self.addItem() });
    
  }
  
  PunchList.prototype.addItem = function() {
    if(!this._adding) {
      this._adding = true;
      this._index++;
      var punchlist_items = $(this.element).find('#punchlist-items');
      var new_item_html = $.map({ [this._index]:{index:false, item:'',comments:[]}},this.options.punchListItemTemplate).join('');
      var newItem = $(new_item_html).appendTo(punchlist_items);
      
      newItem.find('.punchlist-item-tags').remove();
      
      var toAppendInput = newItem.find('.punchlist-item-label-text-data');
      
      var input = document.createElement('input');
      input.type = 'text';
      input.id = 'punch-item' + this._index;
      
      var input = $(input).appendTo(toAppendInput);
      
      input.focus();
      
      var self = this;
      
      input.enterKey(function(){
        $(this).trigger('enterEvent');
      });
            
      input.on('blur enterEvent',function(){
        var todoTitle = input.val();
        var todoTitleLength = todoTitle.length;
        if (todoTitleLength > 0) {
          // TODO: Add new item handler
          $(this).parent().html(todoTitle);
          newItem.find('.fa-times-circle').click( function(){
            self.removeItem(newItem);
          });
        } else {
          newItem.remove();
        }
        self._adding = false;
      });
    }
  }

  PunchList.prototype.removeItem = function(item) {
      // TODO: Add item remove handler
      item.animate({
        left:"-30%",
        height:0,
        opacity:0
        },200);
      setTimeout(function(){
        $(item).remove();             
      }, 1000);
  }
  
  PunchList.prototype.drawItems = function(items) {
    var htmlPunchListContainer = items.map(this.options.punchListItemTemplate).join('');
    var punchlist_items = $(this.element).find('#punchlist-items');
    punchlist_items.html(htmlPunchListContainer);    
    /* Adding Behaviour */
    var self = this;
    
    $(this.element).find('.fa-times-circle').click( function(){
          var parentItem = $(this).parent().parent().parent();
          self.removeItem(parentItem);
    });
    
    $(this.element).find('.fa-comment').click(function(){
      var parentItem = $(this).parent().parent().parent();
      $(parentItem).find('.comments').toggleClass('hidden');
    });
  }
  
  $.fn.punchList = function ( options ) {
      return new PunchList( this, options );
  }
  
  $.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    });
  }
})( jQuery, window, document );