/** 
 * ~/public/js/models/Bet.js
 * ----------------------------
 */ 


define(function(require) {
  
    var Bet = Backbone.Model.extend({ 
	urlRoot: '/bets' 
    });

    return Bet;
});
