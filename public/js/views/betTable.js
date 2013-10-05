define(['models/BetCollection', 
	'text!templates/betTable.html'], 
       function( Bets, betTableTemplate){ 
	   
	   var betTableView = Backbone.View.extend({
	       
	       tagName: 'div', 
	       
	       render: function(){ 
		   console.log('~/public/js/views/betTable.js | render'); 
		   
		   var that = this; 
		   
		   var bets = this.collection.models; 
		   
		   bets.fetch({
		       success: function( bets ){
			   
			   var template = _.template( betTableTemplate, { bets: bets.models }); 
			   
			   that.$el.html(template); 
		       }j
		   }); 
		   
		   return this; 
	       }
	   }); 

	   return betTableView; 
}); 
