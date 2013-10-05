define(['models/BetCollection'], function(BetCollection) {
 

    var Account = Backbone.Model.extend({
    
	urlRoot: '/accounts',

	initialize: function() {
	    this.bets   = new BetCollection();
	    this.bets.url   = '/accounts/' + this.id + '/bets';
	}

    });

    return Account;
});
