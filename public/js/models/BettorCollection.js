/**
 * ~/public/js/models/BettorCollection
 * -----------------------------------
 */



define(['models/Bettor'], function(Bettor) {
  var BettorCollection = Backbone.Collection.extend({
    model: Bettor
  });

  return BettorCollection;
});
