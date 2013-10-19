define(['SocialNetView', 
	'text!templates/bet.html'], 
       function(SocialNetView, betTemplate){
	   
	   var betView = SocialNetView.extend({
	       
	       acceptButton: false, 
	       rejectButton: false, 
	       acceptTeButton: false, 
	       rejectTeButton: false, 
	       acceptWinnerButton: false, 

	       /* 
		* Implementation note: 
		* --------------------
		* Note 1: check to see if the bet is waiting for counterparty approval
		*         and if the counterparty if the user viewing the bet
		* 
		* Note 2: check to see if either party has proposed to cancel the bet
		*         due to a termination event. 
		* 
		*/ 






	       initialize: function(options){
		   
		   this.model.bind('change', this.render, this); 

		   // Note 1
		   if ( !this.model.get('counterpartyAccept') 
			&& (this.model.get('counterpartyId') === options.user.get('_id')) ) { 
		       
		       this.acceptButton = true;
		       this.rejectButton = true;
		       return; 
		   }

		   // Note 2
		   if ( !this.model.get('authorTeAccept') && !this.model.get('counterpartyTeAccept') ) { 
		       if ( this.model.get('authorId') === options.user.get('_id') ||
			    this.model.get('counterpartyId') === options.user.get('_id') ) { 
			   this.acceptTeButton = true;
			   return;
		       }
		   }

		   if ( this.model.get('authorTeAccept') &&
			!this.model.get('counterpartyTeAccept') && 
			(this.model.get('counterpartyId') === options.user.get('_id')) ) {
			   this.acceptTeButton = true;
		           this.rejectTeButton = true;
		           return;
		   }
		       
		  		  		   
		   if ( this.model.get('counterpartyTeAccept') && 
			!this.model.get('authorTeAccept') && 
			(this.model.get('authorId') === options.user.get('_id')) ) {
			   this.acceptTeButton = true;
		           this.rejectTeButton = true; 
		           return; 
		  }
	       }, 

		   
		       
		   


	       
	       el: $('#content'), 
	       
	       events: { 
		   "click .acceptButton": "acceptBet", 
		   "click .rejectButton": "rejectBet", 
		   "click .acceptTeButton": "acceptTerminationEvent", 
		   "click .rejectTeButton": "rejectTerminationEvent", 
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
		   console.log('~/public/js/views/bet.js | acceptBet' );  

		   
		   var $responseArea = this.$('.actionArea'); 
		   $.post('/bets/' + this.model.get('_id'), 
			  {betId: this.model.get('_id'), 
			   counterpartyId: this.model.get('counterpartyId'), 
			   selectedAction: 'rejectBet'
			  }, 
			  function onSuccess() { 
			      $responseArea.text('Bet accepted'); 
			  }, function onError(){ 
			      $responseArea.text('Bet not accepted, retry');
			  }
			 ); 
	       }, 
	       
	       acceptTerminationEvent: function(){
		   //code here
	       }, 

	       rejectTerminationEvent: function(){ 
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
		       acceptWinnerButton: this.acceptWinnerButton
		   })); 
		   
	       }
	   }); 

	   
	   return betView; 
}); 
