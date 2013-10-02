/**
 * ~/public/js/models/HandicapperCollection.js
 * -------------------------------------------
 */



define(function( require ) {
  var Handicappers = Backbone.Collection.extend( {url: '/accounts'} );

  return Handicappers;
});
