/**
 * ~/public/js/models/BetCollection.js
 * -----------------------------------
 */



define(['models/Bet'], function( Bet ) {

  var BetCollection = Backbone.Collection.extend({ model: Bet }); 

  return BetCollection;

});
