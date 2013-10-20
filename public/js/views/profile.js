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
		       
		       console.log('~/public/js/views/profile | render: ' + c ) ;

		       var pendingBets = c.where({pendingBet: true}); 
		       
		       console.log('~/public/js/views/profile | render | 2: ' + pendingBets) ; 
		       
		       var betTableHtml = (new BetTableView( {betArray: pendingBets, accountId: that.model.get('_id') } )).render().el; 
		   
		       $(betTableHtml).appendTo('#pendingBetList');

		       
		   });
		   
	       }

		  	       
		   


	   });

	   return profileView;
});
