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
		   

		   

		   





		   /*


		   $.post('/placebet', {
		       counterparty: $('input[name=counterparty]').val(),
		       betDescription: $('input[name=betDescription]').val(),
		       referenceIndex: $('input[name=referenceIndex').val(), 
		       terminationEvent: $('input[name=terminationEvent]').val(),
		       authorBet: $('input[name=authorBet]').val(), 
		       counterpartyBet: $('input[name=counterpartyBet]').val()
		       
		   }, function onSuccess( data ) {
		       console.log(data);
		       $responseArea.text('Bet Placed'); 
		   }, function onError() {
		       console.log('~/public/js/views/placebet.js | onError'); 
		       $responseArea.text('Could not place bet'); 
		   });
		   */
		   
		   
		   return false; 
	       },

	       render: function() {
		   this.$el.html(placebetTemplate);
	       }
	   });
	   
	   return PlaceBetView;
});
