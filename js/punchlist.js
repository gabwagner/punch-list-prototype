(function ( $ ) {
  
    var i=0;
    
    function convertToPunch(index, toConvert) {
        var comments = [];
        if(toConvert.comments.length>0) {
            for(comment of toConvert.comments) {
              comments.push({comment:comment})
            }
        } else {
          comments.push({comment:"-- No comments --"});
        }
        return {id: index, idx: toConvert.id, todo:toConvert.item, checked: index ? 'checked' : '', comments:comments};
    }
    
    const PunchList =`<div id="punchlist-title">
        <h1><i class="fa fa-check"></i>Punch-List</h1>
      </div>
      <div id="punchlist-items-container">
        <div id="punchlist-items">          
        </div>
        <div id="add-todo">
          <i class="fa fa-plus"></i>
          Add an Item
        </div>        
      </div>`
        
    const PunchListItem = ({ id, checked, todo }) =>  `<div class="punchlist-item">
            <div class="punchlist-item-label">
              <input type="checkbox" id="${id}" ${checked}/>
              <label for="${id}" class="punchlist-item-label-text" title="${todo}">
                <span class="punchlist-item-label-text-line">
                  <span class="punchlist-item-label-text-data">${todo}</span>
                </span>
              </label>
            </div>
            <div class="punchlist-item-action" title="comments">
              <i class="fa fa-comment"></i>
            </div>
            <div class="punchlist-item-action" title="remove">
              <i class="fa fa-times-circle"></i>
            </div>
          </div>`
    
    const PunchListItemEditing = ({ id }) =>  `<div class="punchlist-item">
            <div class="punchlist-item-label">
              <input type="checkbox" id="${id}"/>
              <label for="${id}" class="punchlist-item-label-text">
                <span class="punchlist-item-label-text-line">
                  <span class="punchlist-item-label-text-data"><input type="text" id="input-todo${id}" class="input-todo"></span>
                </span>
              </label>
            </div>
            <div class="punchlist-item-action" title="comments">
              <i class="fa fa-comment"></i>
            </div>
            <div class="punchlist-item-action" title="remove">
              <i class="fa fa-times-circle"></i>
            </div>
          </div><div></div>`
          
    const PunchListItemComment = ({ comment }) =>  `
                <span class="comment">
                ${comment}
                </span>
          `;
     
 
    $.fn.punchList = function() {
      
      $(this).html(PunchList);
      
      var punchlist_items = $(this).find('#punchlist-items');
        
      $.getJSON("json/response.json", function(result){
        
         for(var item of result) {
            var punchItem = convertToPunch(i,item);
            var html_item = [punchItem].map(PunchListItem).join('');
            punchlist_items.append(html_item);
            var comments = $(document.createElement('div'));
            comments.addClass("comments hidden");
            for(var comment of item.comments) {
              var html_item_comment = [comment].map(PunchListItemComment).join('');
              comments.append(html_item_comment);
            }
            punchlist_items.append(comments);
            i++;
         }
         
         $('.fa-times-circle').click(function(){
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

         
        $('.fa-comment').click(function(){
          var parentItem = $(this).parent().parent();
          $(parentItem).next().toggleClass('hidden');
        });
      });        
        
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
 
}( jQuery ));