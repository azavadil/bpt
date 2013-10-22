define(['SocialNetView', 
	'SbCollection', 
	'text!templates/profile.html',
        'text!templates/betTable.html', 
	'models/Bet',
        'views/betTable', 
        'models/BetCollection'],
function(SocialNetView,
	 SbCollection, 
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


	       getModel: function( id, cb ){ 
		   
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
		   
		   var userBetCollection = new BetCollection(); 
		   
		   
		   userBetCollection.fetchMany( this.model.get('bets') ).then(function( c ) { 
		       
		       var openBets = c.where({openBet: true});
		       var openHtml = (new BetTableView( {betArray: openBets} )).render().el; 
		       $(openHtml).appendTo('#openBetList');
		       
		       var closedBets = c.where({closedBet: true});
		       var closedHtml = (new BetTableView( {betArray: closedBets} )).render().el; 
		       $(closedHtml).appendTo('#closedBetList');
 
		       var pendingInitialApproval = c.where({pendingInitialApproval: true}); 
		       var pendingIaHtml = (new BetTableView( {betArray: pendingInitialApproval} )).render().el; 
		       $(pendingIaHtml).appendTo('#pendingInitialApproval');
		       
		       var pendingTe = c.where({pendingTe: true}); 
		       var pendingTeHtml = (new BetTableView( {betArray: pendingTe} )).render().el; 
		       $(pendingTeHtml).appendTo('#pendingTe');

		       var pendingWinnerValidation = c.where({pendingWinner: true}); 
		       var pendingWinHtml = (new BetTableView( {betArray: pendingWinnerValidation} )).render().el; 
		       $(pendingWinHtml).appendTo('#pendingWinnerValidation');


		   });
		   
	       }

		  	       
		   


	   });

	   return profileView;
});
