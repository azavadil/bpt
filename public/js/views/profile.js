define(['SocialNetView', 
	'text!templates/profile.html',
        'text!templates/bet.html', 
	'models/Bet',
        'views/bet'],
function(SocialNetView, 
	 profileTemplate,
         betTemplate, 
	 Bet, 
	 BetView)
       {
	   var profileView = SocialNetView.extend({
	       
	       el: $('#content'),

	       events: {
		   //code here
	       },

	       initialize: function () {
		   this.model.bind('change', this.render, this);
	       },

	       prependBet: function( betModel ){ 
		   var betHtml = (new BetView({model: betModel})).render().el; 
		   $(betHtml).appendTo('.bet_list').hide().fadeIn('slow'); 
	       }, 

 
	       render: function() {

		   var that = this;

		   console.log('~/public/js/views/profileView | render | model.toJSON(): ' + this.model.toJSON()); 


		   this.$el.html(
		       _.template(profileTemplate,this.model.toJSON())
		   );
		   
		   
		   var betCollection = this.model.get('bets');
		   if ( null != betCollection ) {
		       _.each(betCollection, function ( betJson ) {
			   var betModel = new Bet( betJson) ;
			   that.prependBet( betModel );
		       });
		   }
		   
	       }
	   });

	   return profileView;
});
