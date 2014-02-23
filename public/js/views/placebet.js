define(['SocialNetView', 
	'text!templates/placebet.html', 
        'bootstrap'], 
       function(SocialNetView, 
		placebetTemplate, 
	        Bootstrap) {
	   

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
			     $responseArea.text('Bet placed, waiting for counterparty to accept'); 
			      }).error(function(){
				  $responseArea.text('Bet not placed'); 
				  $responseArea.slideDown(); 
			      }); 
		   
		   
		   return false; 
	       },

	       render: function() {
		   
		   var curTemplate = placebetTemplate; 
		   
		   this.$el.html(curTemplate);
		   $('.bpt-popover').popover(); 

	       }
	   });
	   
	   return PlaceBetView;
});
