define(['models/BettorCollection'], function(BettorCollection) {
  var Account = Backbone.Model.extend({
    urlRoot: '/accounts',

    initialize: function() {
      this.bets   = new BettorCollection();
      this.bets.url   = '/accounts/' + this.id + '/bets';
    }

  });

  return Account;
});
