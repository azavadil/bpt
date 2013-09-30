/** 
 * ~/public/js/models/Bettor.js
 * ----------------------------
 */ 


define(function(require) {
  var Bettor = Backbone.Model.extend({
    urlRoot: '/accounts/' + this.accountId 
  });

  return Bettor;
});
