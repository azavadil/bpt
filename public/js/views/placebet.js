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
		       username: $('input[name=counterparty]').val(),
		       betDescription: $('input[name=description]').val(),
		       referenceIndex: $('input[name=refIndex').val(), 
		       terminationEvent: $('input[name=terminationEvent]').val(),
		       authorBet: $('input[name=thisBet]').val(), 
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
