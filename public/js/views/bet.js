define(['SocialNetView', 
	'text!templates/bet.html'], 
       function(SocialNetView, betTemplate){
	   
	   var betView = SocialNetView.extend({
	       
	       tagName: 'li', 
	       
	       render: function(){
		   $(this.el).html(_.template(betTemplate, this.model.toJSON())); 
		   return this; 
	       }
	   }); 

	   
	   return betView; 
}); 
