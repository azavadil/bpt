define(['models/BetCollection', 
	'text!templates/betTable.html'], 
       function( Bets, betTableTemplate){ 
	   
	   var betTableView = Backbone.View.extend({
	       
	       tagName: 'div', 
	       
	       render: function(){ 
		   
		   
		   var that = this; 
		   
		   var bets = this.options.betArray; 

		   console.log('~/public/js/views/betTable.js | render | this.collection: ' + bets); 


		   
		   var templateArgs = { bets: bets, accountId: this.options.accountId}; 

		   var template = _.template( betTableTemplate, templateArgs ); 
		   
		   that.$el.html( template ); 

 
		   return this; 
	       }
	   }); 

	   return betTableView; 
}); 
