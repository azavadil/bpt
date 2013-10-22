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


		   // Note 1
		   if ( this.model.get('closedBet') ) { 
		       return; 
		   }

		   // Note 2
		   if ( this.model.get('counterpartyAccept') === null && curUserIsCp ) { 
		       this.acceptButton = true;
		       this.rejectButton = true;
		       return; 
		   }

		   // Note 3
		   if ( this.model.get('authorTeAccept') === null &&
			this.model.get('counterpartyTeAccept') === null &&
			this.model.get('openBet') ) { 
		       
		       if (  curUserIsAuthor || curUserIsCp ) { 
			   this.acceptTeButton = true;
			   return;
		       }
		   }

		   if ( this.model.get('openBet') && 
			this.model.get('authorTeAccept') &&
			!this.model.get('counterpartyTeAccept') &&
			curUserIsCp ) {
	
		           this.acceptTeButton = true;
		           this.rejectTeButton = true;
		           return;
		   }
		       
		  		  		   
		   if ( this.model.get('openBet') && 
			this.model.get('counterpartyTeAccept') && 
			!this.model.get('authorTeAccept') && 
			(this.model.get('authorId') === options.user.get('_id')) ) {
			
		           this.acceptTeButton = true;
		           this.rejectTeButton = true; 
		           return; 
		  }

		   if ( this.model.get('openBet') ) {
		       // TODO: change this to look for pendingWinnerApproval
		   }
			

		   
	       }, 

	       
	       el: $('#content'), 
	       
	       events: { 
		   "click .acceptButton": "acceptBet", 
		   "click .rejectButton": "rejectBet", 
		   "click .acceptTeButton": "acceptTerminationEvent", 
		   "click .rejectTeButton": "rejectTerminationEvent",
		   "click .declareWinnerDropdown": "declareWinner", 
		   "click .acceptWinnerButton": "acceptWinner"
	       }, 

	       /*
		* TODO: 
		* -----
		* Validate that user is counterparty
		* 
		*/ 

	       acceptBet: function(){ 

		   console.log('~/public/js/views/bet.js | acceptBet' );  

		   
		   var $responseArea = this.$('.actionArea'); 
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   counterpartyId: this.model.get('counterpartyId'), 
			   selectedAction: 'acceptBet'
			  }, 
			  function onSuccess() { 
			      $responseArea.text('Bet accepted'); 
			  }, function onError(){ 
			      $responseArea.text('Bet not accepted, retry');
			  }
			 ); 
	       }, 

	       rejectBet: function(){ 
		   console.log('~/public/js/views/bet.js | rejectBet' );  

		   
		   var $responseArea = this.$('.actionArea'); 
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   counterpartyId: this.model.get('counterpartyId'), 
			   selectedAction: 'rejectBet'
			  }, 
			  function onSuccess() { 
			      $responseArea.text('Bet rejected'); 
			  }, function onError(){ 
			      $responseArea.text('Bet not rejected, retry');
			  }
			 ); 
	       }, 
	       
	       acceptTerminationEvent: function(){
		   var $responseArea = this.$('.actionArea'); 
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   counterpartyId: this.model.get('counterpartyId'), 
			   selectedAction: 'acceptTe'
			  }, 
			  function onSuccess() { 
			      $responseArea.text('Termination event accepted'); 
			  }, function onError(){ 
			      $responseArea.text('Termination event not accepted, retry');
			  }
			 ); 
	       }, 

	       rejectTerminationEvent: function(){ 
		   var $responseArea = this.$('.actionArea'); 
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   counterpartyId: this.model.get('counterpartyId'), 
			   selectedAction: 'rejectTe'
			  }, 
			  function onSuccess() { 
			      $responseArea.text('Termination event accepted'); 
			  }, function onError(){ 
			      $responseArea.text('Termination event not accepted, retry');
			  }
			 );
	       }, 
	       
	       declareWinner: function(){ 
		   //code here
	       }, 

	       acceptWinner: function(){
		   //code here
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
		       acceptWinnerButton: this.acceptWinnerButton
		   })); 
		   
	       }
	   }); 

	   
	   return betView; 
}); 
