/** 
 * ~/public/js/views/index.js
 * --------------------------
 */


define(['SocialNetView', 
	'models/HandicapperCollection',
	'views/handicappersSubview', 
	'text!templates/index.html'],
function(SocialNetView, 
	 HandicapperCollection, 
	 HandicappersView, 
	 indexTemplate) {
  
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

	    var hndListHtml = (new HandicappersView()).render().el; 
	    $(hndListHtml).appendTo('.bettors_list').hide().fadeIn('slow'); 
	}
    });

    return indexView;
});
