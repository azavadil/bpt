define(['SocialNetView', 
	'text!templates/bet.html'], 
       function(SocialNetView, betTemplate){
	   
	   var betView = SocialNetView.extend({
	       
	       el: $('#content'), 

	       
	       render: function(){
		   
		   console.log('~/public/js/views/bet.js | render | model: ' + this.model); 

		   $(this.el).html(_.template(betTemplate, this.model.toJSON())); 
		   

		   /*
		   model.fetch({ 
		       success: function(){ 

			   console.log('~/public/js/views/bet.js | render | model: ' + this.model.get('authorName')); 

			   $(this.el).html(_.template(betTemplate, this.model.toJSON())); 

		       }
		   })
		   */
	       }
	   }); 

	   
	   return betView; 
}); 
