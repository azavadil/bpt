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
		   $.post('/placebet', {
		       counterparty: $('input[name=counterparty]').val(),
		       betDescription: $('input[name=betDescription]').val(),
		       referenceIndex: $('input[name=referenceIndex').val(), 
		       terminationEvent: $('input[name=terminationEvent]').val(),
		       authorBet: $('input[name=authorBet]').val(), 
		       counterpartyBet: $('input[name=counterpartyBet]').val()
		       
		   }, function(data) {
		       console.log(data);
		       window.location.hash = 'index';  //profile is probably betterdd
		   });
		   return false;
	       },

	       render: function() {
		   this.$el.html(placebetTemplate);
	       }
	   });
	   
	   return PlaceBetView;
});
