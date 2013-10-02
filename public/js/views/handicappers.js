/**
 * ~/public/js/views/handicappers.js
 * ---------------------------------
 */ 


//need to bring back SocialNetView

define(['models/HandicapperCollection', 'text!templates/handicapperList.html'],
function( Handicappers, hndListTemplate) {
  

    var handicappersView = Backbone.View.extend({
      
      el: $('#content'),

      render: function() {

	  console.log('~/public/js/views/handicappers.js | render'); 
	  


	  var that = this; 
	  var handicappers = new Handicappers(); 

	  
	  /*
	  handicappers.fetch( { 
	      success: function( handicappers ){ 
		  that.$el.html('CONTENT SHOULD BE HERE'); 
	      }
	  }); 

	  */


	  handicappers.fetch( { 
	      success: function( handicappers ) { 
		  

		  
		  //handicappers.forEach( function(elem, index, array){ 
		  //    console.log('~/public/js/views/handicappers.js | render: ' + elem);
		  //} 
		  console.log('~/public/js/views/handicappers.js | render | .fetch | success ' + handicappers.models); 
		  

		  var template = _.template(hndListTemplate, {handicappers: handicappers.models} ); 
		
		  that.$el.html(template); 
	      }
	  });


      }


  });

  return handicappersView;
});
