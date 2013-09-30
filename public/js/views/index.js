/** 
 * ~/public/js/views/index.js
 * --------------------------
 */


define(['SocialNetView', 'text!templates/index.html'],
function(SocialNetView, indexTemplate) {
  var indexView = SocialNetView.extend({
    el: $('#content'),

    events: {
      "submit form": "updateStatus"
    },

    initialize: function() {
    },

    updateStatus: function(){ 
	//code
    }, 

	

    
    render: function() {
      this.$el.html(indexTemplate);
    }
  });

  return indexView;
});
