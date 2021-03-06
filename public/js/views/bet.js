define(['SocialNetView', 
	'text!templates/bet.html'], 
       function(SocialNetView, betTemplate){
	   
	   var betView = SocialNetView.extend({
	       
	       acceptButton: false, 
	       rejectButton: false, 
	       acceptTeButton: false, 
	       rejectTeButton: false, 
	       declareWinnerButton: false, 
	       acceptWinnerButton: false, 

	       /* 
		* Implementation note: 
		* --------------------
		* Note 1: If the bet is closed, no buttons
		* 
		* Note 2: check to see if the bet is waiting for counterparty approval
		*         and if the counterparty if the user viewing the bet
		* 
		* Note 3: check to see if either party has proposed to cancel the bet
		*         due to a termination event. 
		* 
		*/ 






	       initialize: function(options){
		   
		   this.model.bind('change', this.render, this); 
		   

		   var curUserIsAuthor, curUserIsCp; 
		   curUserIsAuthor = curUserIsCp = false; 
		   if ( this.model.get('authorId') === options.user.get('_id') ) { 
		       curUserIsAuthor = true; 
		   } else if ( this.model.get('counterpartyId') === options.user.get('_id') ) { 
		       curUserIsCp = true; 
		   }

		   
		   if ( !curUserIsAuthor && !curUserIsCp ) { 
		       return; 
		   }


		   if ( this.model.get('closedBet') ) { 
		       return; 
		   }

		   
		   if ( this.model.get('pendingInitialApproval') && curUserIsCp ) { 
		       this.acceptButton = true;
		       this.rejectButton = true;
		       return; 
		   }

		   // Termination Buttons
		   if ( this.model.get('openBet') && !this.model.get('pendingTe') ){
		       this.acceptTeButton = true;
		   } else if ( this.model.get('pendingTe') ){  
	               if ( curUserIsAuthor && !this.model.get('authorTeAccept') ) { 
			   this.acceptTeButton = true;
			   this.rejectTeButton = true; 
		       } 
		       if ( curUserIsCp && !this.model.get('counterpartyTeAccept') ){ 
			   this.acceptTeButton = true; 
			   this.rejectTeButton = true; 
		       }
		       
		   }
		       
		   // Winner buttons
		   if ( this.model.get('openBet') && !this.model.get('pendingTe') && !this.model.get('pendingWinner') ) { 
		       this.declareWinnerButton = true; 
		   } else if ( this.model.get('pendingWinner') ){
		       this.acceptTeButton = false; 
		       this.rejectTeButton = false;
		       if ( curUserIsAuthor && !this.model.get('authorValidation') ) { 
			   this.acceptWinnerButton = true;
			   this.rejectWinnerButton = true; 
		       } 
		       if ( curUserIsCp && !this.model.get('counterpartyValidation') ){ 
			   this.acceptWinnerButton = true; 
			   this.rejectWinnerButton = true; 
		       } 
		  }

			

		   
	       }, 

	       
	       el: $('#content'), 
	       
	       events: { 
		   "click #acceptLink": "acceptBet", 
		   "click #rejectLink": "rejectBet",
		   "click #acceptTeLink": "acceptTerminationEvent", 
		   "click #rejectTeLink": "rejectTerminationEvent",
		   "change .declareWinnerDropdown": "declareWinner", 
		   "click #acceptWinnerLink": "acceptWinner", 
		   "click #rejectWinnerLink": "rejectWinner"
	       }, 

	       /*
		* TODO: 
		* -----
		* Validate that user is counterparty
		* 
		*/ 

	       acceptBet: function(){ 

		   console.log('~/public/js/views/bet.js | acceptBet' );  

		   

		   var self = this; 
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   counterpartyId: this.model.get('counterpartyId'), 
			   selectedAction: 'acceptBet'
			  }, 
			  function() {
			      self.$("#acceptLink").remove(); 
			      self.$("#rejectLink").remove(); 
			      var successMsg = "<div>Bet Accepted</div>"; 
			      self.$el.append(successMsg);
			      
			  }).error(function (){
			      var errorMsg = "<div>Bet not accepted, retry"; 
			      self.$el.append(errorMsg);
			  }); 
	       }, 

	       rejectBet: function(){ 
		   console.log('~/public/js/views/bet.js | rejectBet' );  

		   var self = this; 
	
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   counterpartyId: this.model.get('counterpartyId'), 
			   selectedAction: 'rejectBet'
			  }, 
			  function () {
			      self.$("#acceptLink").remove(); 
			      self.$("#rejectLink").remove(); 
			      var successMsg = "<div>Bet rejected</div>"; 
			      self.$el.append(successMsg); 
			  }).error(function(){
			      var errorMsg = "<div>Bet not rejected, retry</div>"; 
			      self.$el.append(errorMsg); 
			  }); 
	       }, 
	       
	       acceptTerminationEvent: function(){
		   var self = this;

		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   counterpartyId: this.model.get('counterpartyId'), 
			   selectedAction: 'acceptTe'
			  }, 
			  function() { 
			      self.$("#acceptTeLink").remove(); 
			      self.$("#rejectTeLink").remove(); 
			      var successMsg = "<div>Termination event submitted</div>"
			      self.$el.append(successMsg);
			  }).error(function(){
			      var errorMsg = "<div>Termination event not accepted, retry</div>"; 
			      self.$el.append(errorMsg); 
			  });
	       }, 

	       rejectTerminationEvent: function(){ 
		   var self = this; 
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   counterpartyId: this.model.get('counterpartyId'), 
			   selectedAction: 'rejectTe'
			  }, 
			  function() {
			      self.$("#acceptTeLink").remove(); 
			      self.$("#rejectTeLink").remove(); 
			      var successMsg = "<div>Termination event accepted</div>"
			      self.$el.append(successMsg); 

			  }).error(function(){
			      var errorMsg = "<div>Termination event not accepted, retry</div>"
			      self.$el.append(errorMsg); 
			  });
	       }, 
	       
	       declareWinner: function(){ 
		   var $responseArea = this.$('.actionArea');
		   var winner = this.$('.declareWinnerDropdown').val();
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   selectedAction: 'declareWinner', 
			   winner: winner
			  }, 
			  function onSuccess() { 
			      $responseArea.text('Winner declared'); 
			  }, function onError(){ 
			      $responseArea.text('Action failed, retry');
			  }); 
		 
	       }, 

	       acceptWinner: function(){
		   var $responseArea = this.$('.actionArea');
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   selectedAction: 'acceptWinner', 
			  }, 
			  function onSuccess() { 
			      $responseArea.text('Winner accepted'); 
			  }, function onError(){ 
			      $responseArea.text('Action failed, retry');
			  }
			 );
	       },
	       
	       rejectWinner: function(){ 
		   var $responseArea = this.$('.actionArea');
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   selectedAction: 'rejectWinner' 
			  }, 
			  function onSuccess() { 
			      $responseArea.text('Winner rejected'); 
			  }, function onError(){ 
			      $responseArea.text('Action failed, retry');
			  }
			 );
	       }, 
	       
		   
       
	       render: function(){
		   
		   console.log('~/public/js/views/bet.js | render | acceptButton: ' + this.acceptButton); 

		   $(this.el).html(_.template(betTemplate,{ 
		       model:this.model.toJSON(),
		       acceptButton: this.acceptButton, 
		       rejectButton: this.rejectButton, 
		       acceptTeButton: this.acceptTeButton, 
		       rejectTeButton: this.rejectTeButton, 
		       declareWinnerButton: this.declareWinnerButton, 
		       acceptWinnerButton: this.acceptWinnerButton, 
		       rejectWinnerButton: this.rejectWinnerButton
		   })); 
		   
	       }
	   }); 

	   
	   return betView; 
}); 
