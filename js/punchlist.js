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
              punchListItemTemplate: (item, index) =>  `<div class="punchlist-item">
              <div class="punchlist-item-label">
                <input type="checkbox" id="${index}" />
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
            <div class="comments hidden">
               ${item.comments.map( comment => `<span class="comment">${comment.comment}</span>`).join('')}
            </div>
            `,
              punchListItemCommentTemplate: ({ comment }) =>  `<span class="comment">${comment}</span>`           
            };

  function PunchList( element, options ) {    
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = punchList;
    this._index = 0;
    this.init();
  }          

  PunchList.prototype.init = function() {
    var htmlPunchListContainer = [{title: this.options.title}].map(this.options.punchListContainerTemplate).join('');
    $(this.element).html(htmlPunchListContainer);
    // TODO: Exception management for call 
    var self = this;
    $.getJSON(this.options.apiCall, function(items) { 
      self.index = items.length;
      self.drawItems(items);
    });
    /* Adding Add Behaviour */
  }
  
  PunchList.prototype.drawItems = function(items) {
    var htmlPunchListContainer = items.map(this.options.punchListItemTemplate).join('');
    var punchlist_items = $(this.element).find('#punchlist-items');
    punchlist_items.html(htmlPunchListContainer);    
    /* Adding Behaviour */
    $(this.element).find('.fa-times-circle').click(function(){
          var parentItem = $(this).parent().parent();
          $(parentItem).next().remove();
          parentItem.animate({
            left:"-30%",
            height:0,
            opacity:0
            },200);
          setTimeout(function(){
            $(parentItem).remove();             
          }, 1000);
        });        

    $(this.element).find('.fa-comment').click(function(){
      var parentItem = $(this).parent().parent();
      $(parentItem).next().toggleClass('hidden');
    });
  }
  
  $.fn.punchList = function ( options ) {
      return new PunchList( this, options );
  }
  
})( jQuery, window, document );

/*
(function ( $ ) {
        
      $('#add-todo').click(function(){
        i++;
        var newId = i;
        var html_item = [{id:newId}].map(PunchListItemEditing).join('');
        
        punchlist_items.append(html_item);
        
        $('#input-todo'+newId+'').parent().parent().animate({
          height:"36px"
        },200);
        $('#input-todo'+newId+'').focus();
        $('#input-todo'+newId+'').enterKey(function(){
          $(this).trigger('enterEvent');
        })
        
        $('#input-todo'+newId+'').on('blur enterEvent',function(){
          var todoTitle = $('#input-todo'+newId+'').val();
          var todoTitleLength = todoTitle.length;
      if (todoTitleLength > 0) {
        $(this).before(todoTitle);
        $(this).parent().parent().removeClass('editing');
        $(this).parent().after('<span class="delete-item" title="remove"><i class="fa fa-times-circle"></i></span>');
        $(this).remove();
        $('.delete-item').click(function(){
          var parentItem = $(this).parent();
          parentItem.animate({
            left:"-30%",
            height:0,
            opacity:0
          },200);
          setTimeout(function(){ $(parentItem).remove(); }, 1000);
        });
      }
      else {
        $('.editing').animate({
          height:'0px'
        },200);
        setTimeout(function(){
          $('.editing').remove()
        },400)
      }
    });

  });
        
        return this;
    };
    
      $.fn.enterKey = function (fnc) {
      return this.each(function () {
          $(this).keypress(function (ev) {
              var keycode = (ev.keyCode ? ev.keyCode : ev.which);
              if (keycode == '13') {
                  fnc.call(this, ev);
              }
          })
      })
  }
 
}( jQuery ));*/