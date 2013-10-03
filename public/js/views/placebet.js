define(['SocialNetView', 
	'text!templates/placebet.html'], 
       function(SocialNetView, 
		placebetTemplate) {
	   

	   var PlaceBetView = SocialNetView.extend({
	       
	       requireLogin: false,

	       el: $('#content'),

	       events: {
		   "submit form": "placebet"
	       },

	       placebet: function() {
		   
		   
		   console.log('~/public/js/views/placebet.js | placebet'); 
		   var $responseArea = this.$('#actionArea'); 

		   var view = this; 
		   
		   $.post('/placebet', 
			  this.$('form').serialize(), function( ){ 
			     $responseArea.text('Bet Placed'); 
			      }).error(function(){
				  $responseArea.text('Bet not placed'); 
				  $responeArea.slideDown(); 
			      }); 
		   
		   
		   return false; 
	       },

	       render: function() {
		   this.$el.html(placebetTemplate);
	       }
	   });
	   
	   return PlaceBetView;
});
