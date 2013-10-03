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

 
	       render: function() {
		   var that = this;
		   this.$el.html(
		       _.template(profileTemplate,this.model.toJSON())
		   );

		   var betCollection = this.model.get('bet');
		   if ( null != statusCollection ) {
		       _.each(statusCollection, function (statusJson) {
			   var statusModel = new Status(statusJson);
			   that.prependStatus(statusModel);
		       });
		   }
	       }
	   });

	   return profileView;
});
