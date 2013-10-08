define(['SocialNetView', 
	'text!templates/profile.html',
        'text!templates/betTable.html', 
	'models/Bet',
        'views/betTable', 
        'models/BetCollection'],
function(SocialNetView, 
	 profileTemplate,
         betTableTemplate, 
	 Bet, 
	 BetTableView, 
	 BetCollection)
       {
	   var profileView = SocialNetView.extend({
	       
	       el: $('#content'),

	       events: {
		   //code here
	       },

	       initialize: function () {
		   this.model.bind('change', this.render, this);
	       },


	       getModel: function( id ){ 
		   
		   var bet = new Bet({id:id}); 
		   bet.fetch(); 
		   return bet; 
	       },
 
	       render: function() {

		   
		   
		   
		   
		   var that = this;
		   
		   var modelJson = this.model.toJSON(); 
		   

		   this.$el.html(
		       _.template(profileTemplate,this.model.toJSON())
		   );
		   

		   
		   var betArray = this.model.get('bets');
		   
		   betArray = _.filter(betArray, function( betModel ) { return betModel.counterpartyAccept === false; }); 
		   
		   var betTableHtml = (new BetTableView( {betArray: betArray, accountId: that.model.get('_id') } )).render().el; 
		   
		   $(betTableHtml).appendTo('#pendingBetList');
		  	       
	       }
	   });

	   return profileView;
});
