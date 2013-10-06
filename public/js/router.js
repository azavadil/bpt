/** 
 * ~/public/js/router.js
 * ---------------------
 */


define(['views/index', 
	'views/register', 
	'views/login',
        'views/forgotpassword', 
	'views/profile',
	'views/handicappers', 
	'views/placebet', 
	'views/bet', 
	'models/Account', 
	'models/Bettor',
	'models/Bet', 
	'models/BettorCollection'],
function(IndexView, 
	 RegisterView, 
	 LoginView, 
	 ForgotPasswordView, 
	 ProfileView, 
	 HandicapperListView, 
	 PlacebetView,
	 BetView, 
	 Account, 
	 Bettor, 
	 Bet, 
	 BettorCollection) {
  

    
var SocialRouter = Backbone.Router.extend({
    currentView: null,

    routes: {
	'index': 'index',
	'login': 'login',
	'register': 'register',
	'bettors': 'bettors', 
	'forgotpassword': 'forgotpassword',
	'profile/:id': 'profile',
	'accounts/:id': 'accounts',
	'bets/:id': 'bets', 
	'placebet': 'placebet'
    },

    changeView: function(view) {
      if ( null != this.currentView ) {
        this.currentView.undelegateEvents();
      }
      this.currentView = view;
      this.currentView.render();
    },

    index: function() {
	this.changeView( new IndexView()); 
    },


    bettors: function(){
	this.changeView( new HandicapperListView() ); 
    }, 

    login: function() {
      this.changeView(new LoginView());
    },

    forgotpassword: function() {
      this.changeView(new ForgotPasswordView());
    },

    register: function() {
      this.changeView(new RegisterView());
    },

    profile: function(id) {

	var model = new Account({id:id});
	model.fetch({ success: function(){ console.log('~/public/js/router.js | profile | username: ' + model.get('username')); }} );

	this.changeView(new ProfileView({model:model}));

    },
    
    accounts: function(id) {
	console.log('~/public/js/router.js | profile | id: ' + id); 

	var model = new Account({id:id});
	model.fetch();
	this.changeView(new ProfileView({model:model}));

    },
    
    bets: function(id) { 

	
	var betModel = new Bet({id:id}); 

	betModel.fetch( { 
	    success: function(){  
		    
		console.log('~/public/js/router.js | bet | : ' + betModel.get('authorname') ); 
		
	    }
	}); 

	this.changeView(new BetView({model: betModel})); 
    }, 


    placebet: function(){
	this.changeView(new PlacebetView()); 
    }


  });

  return new SocialRouter();
});

