/**
 * ~/public/js/views/handicappers.js
 * ---------------------------------
 */ 


//need to bring back SocialNetView

define(['models/HandicapperCollection', 'text!templates/handicapperList.html'],
function( Handicappers, hndListTemplate) {
  

    var handicappersView = Backbone.View.extend({
      

	tagName: 'div', 

 

      	
	render: function() {

	    console.log('~/public/js/views/handicappers.js | render'); 
	  
	    var that = this; 
	    var handicappers = new Handicappers(); 

 
	  
	    handicappers.fetch( { 
		success: function( handicappers ) { 
		    
		    var sortedModels = _.sortBy( handicappers.models, function( model ) { 
			model.get('accountBal'); 
		    }); 
		  
		    var template = _.template(hndListTemplate, {handicappers: sortedModels} ); 
		    
		    that.$el.html(template); 
		}
	    });

	    return this; 
	}


    });

  return handicappersView;
});
