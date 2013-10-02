/** 
 * ~/public/js/views/index.js
 * --------------------------
 */


define(['SocialNetView', 'models/HandicapperCollection', 'text!templates/index.html'],
function(SocialNetView, HandicapperCollection, indexTemplate) {
  
    var indexView = SocialNetView.extend({
	el: $('#content'),

	events: {
	    "submit form": "updateStatus"
	},

	initialize: function() {
	    console.log("~/public/js/views/index.js | init"); 
	    //this.collection.on('reset', this.renderCollection, this); 
	    //

	},

	updateStatus: function(){ 
	    //code
	}, 

	renderCollection: function( collection ){ 
	    $('.bettors_list').empty(); 
	    collection.each(function( bettor ) { 
		var bettorHtml = (new BettorView( { model: bettor } )).render.el; 
		$(bettorHtml).appendTo('bettors_list').hide().fadeIn('slow'); 
	    }); 
	}, 
    
	render: function() {
	    this.$el.html(indexTemplate); 
	}
    });

    return indexView;
});
