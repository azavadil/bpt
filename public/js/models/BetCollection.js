/**
 * ~/public/js/models/BetCollection.js
 * -----------------------------------
 */



define(['models/Bet'], function( Bet ) {


  var BetCollection = Backbone.Collection.extend({ 
      
      model: Bet,  

  }); 

  var fetchManyMixin = {
     fetchMany: function(ids, options) {
	 var collection = this;
	 var promises = _.map(ids, function(id) {
	     var instance = collection.get(id);
	     if(!instance) {
		 instance = new collection.model({id:id});
		 collection.add(instance);
	      }
	     return instance.fetch(options);
	 });
	 //promise that all fetches will complete, give the collection as parameter
	 return $.when.apply(this, promises).pipe(function() { return collection; });
     }
  }
      
  _.extend(BetCollection.prototype, fetchManyMixin); 

  return BetCollection;

});
