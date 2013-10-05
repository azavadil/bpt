define(['SocialNetView', 
	'text!templates/profile.html',
        'text!templates/betTable.html', 
	'models/Bet',
        'views/betTable'],
function(SocialNetView, 
	 profileTemplate,
         betTableTemplate, 
	 Bet, 
	 BetTableView)
       {
	   var profileView = SocialNetView.extend({
	       
	       el: $('#content'),

	       events: {
		   //code here
	       },

	       initialize: function () {
		   this.model.bind('change', this.render, this);
	       },


 
	       render: function() {

		   var that = this;
		   
		   var modelJson = this.model.toJSON(); 
		   

		   this.$el.html(
		       _.template(profileTemplate,this.model.toJSON())
		   );
		   
		   
		   var betCollection = this.model.get('bets');

		   console.log('~/public/js/views/profileView | render | betCollection: ' + betCollection.toString()); 


		   var betTableHtml = (new BetTableView( {collection: betCollection} )).render().el; 
		   
		   $(betTableHtml).appendTo('#pendingBetList'); 

		   
	       }
	   });

	   return profileView;
});
