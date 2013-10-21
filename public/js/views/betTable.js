define(['models/BetCollection', 
	'text!templates/betTable.html'], 
       function( Bets, betTableTemplate){ 
	   
	   var betTableView = Backbone.View.extend({
	       
	       tagName: 'div', 
	       
	       render: function(){ 
		   
		   
		   var that = this; 
		   
		   var bets = this.options.betArray; 

		   var templateArgs = { bets: bets }; 

		   var template = _.template( betTableTemplate, templateArgs ); 
		   
		   that.$el.html( template ); 

 
		   return this; 
	       }
	   }); 

	   return betTableView; 
}); 
