/**
 * ~/routes/accounts.js
 * -------------------- 
 *
 */ 






module.exports = function(app, models){ 
    
    app.get('/accounts', function(req, res){
	
	models.Account.allBettors( function( err, accounts ) {
	    
	    if(err) console.log('error querying the database'); 
	    
	    res.send( accounts );
	});
    }); 
	   
	

    app.get('/accounts/:id/contacts', function(req, res) {
	var accountId = req.params.id == 'me'
            ? req.session.accountId
            : req.params.id;
	models.Account.findById(accountId, function(account) {
	    res.send(account.contacts);
	});
    });

    app.get('/accounts/:id/activity', function(req, res) {
	var accountId = req.params.id == 'me'
            ? req.session.accountId
            : req.params.id;
	models.Account.findById(accountId, function(account) {
	    res.send(account.activity);
	});
    });

    app.get('/accounts/:id/bets', function(req, res) {
	var accountId = req.params.id == 'me'
            ? req.session.accountId
            : req.params.id;
	models.Account.findById(accountId, function(account) {
	    res.send( account.bets );
	});
    });

    app.post('/accounts/:id/status', function(req, res) {
	var accountId = req.params.id == 'me'
            ? req.session.accountId
            : req.params.id;
	models.Account.findById(accountId, function(account) {
	    status = {
		name: account.name,
		status: req.param('status', '')
	    };
	    account.status.push(status);

	    // Push the status to all friends
	    account.activity.push(status);
	    account.save(function (err) {
		if (err) {
		    console.log('Error saving account: ' + err);
		}
	    });
	});
	res.send(200);
    });

    app.delete('/accounts/:id/contact', function(req,res) {
	var accountId = req.params.id == 'me'
            ? req.session.accountId
            : req.params.id;
	var contactId = req.param('contactId', null);


	// Missing contactId, don't bother going any further
	if ( null == contactId ) {
	    res.send(400);
	    return;
	}

	models.Account.findById(accountId, function(account) {
	    if ( !account ) return;
	    models.Account.findById(contactId, function(contact,err) {
		if ( !contact ) return;

		models.Account.removeContact(account, contactId);
		// Kill the reverse link
		models.Account.removeContact(contact, accountId);
	    });
	});

	// Note: Not in callback - this endpoint returns immediately and
	// processes in the background
	res.send(200);
    });

    app.post('/accounts/:id/contact', function(req,res) {
	var accountId = req.params.id == 'me'
            ? req.session.accountId
            : req.params.id;
	var contactId = req.param('contactId', null);

	// Missing contactId, don't bother going any further
	if ( null == contactId ) {
	    res.send(400);
	    return;
	}

	models.Account.findById(accountId, function(account) {
	    if ( account ) {
		models.Account.findById(contactId, function(contact) {
		    models.Account.addContact(account, contact);

		    // Make the reverse link
		    models.Account.addContact(contact, account);
		    account.save();
		});
	    }
	});

	// Note: Not in callback - this endpoint returns immediately and
	// processes in the background
	res.send(200);
    });

    app.get('/accounts/:id', function(req, res) {
	var accountId = req.params.id == 'me'
            ? req.session.accountId
            : req.params.id;
	models.Account.findById(accountId, function(account) {
	    res.send(account);  //POSSIBLE SECURITY BREACH
	});
    });

    app.get('/bets/:id', function(req, res) {
	
	console.log('~/routes/accounts | get/bets/:id ' + req.params.id ); 
	
	var betId = req.params.id; 

	models.Account.findBetById(betId, function( bet ) {
	    
	    console.log('~/routes/accounts | get/bets/:id | callback' ); 

	    res.send( bet ); 
	});
    });

    app.post('/bets/:id', function(req, res) {

	console.log('~/routes/accounts.js | app.post/bets/:id | ids: ' + req.param('counterpartyId') + ", "  + req.session.accountId) 
	
	models.Account.findBetById( req.params.id, function( betDoc ) { 

 	    console.log('~/routes/accounts | post/bets/:id | betDoc.authorId, req.session.Id: ' 
			+ betDoc.counterpartyId +", "
			+ betDoc.authorId + ", " 
			+ req.session.accountId ); 

	    // only the author and the counterparty are authorized to modify the bet
	    if ( betDoc.counterpartyId.toString() === req.session.accountId || 
	         betDoc.authorId.toString() === req.session.accountId ) { 
		

		var curUserIsAuthor, curUserIsCp; 
		curUserIsAuthor = curUserIsCp = false; 
		if ( betDoc.authorId.toString() === req.session.accountId ) { 
		    curUserIsAuthor = true; 
		}
		if ( betDoc.counterpartyId.toString() === req.session.accountId ){ 
		    curUserIsCp = true; 
		}

		

		var betId = req.params.id; 
	    
		var selectedAction = req.param('selectedAction');

		var cpAccept, cpReject, pendingIa, pendingTe, pendingWinner, winner;   
		var openBet,closedBet, aTeAccept, cpTeAccept, aValidation, cpValidation; 
		
		cpAccept = betDoc.counterpartyAccept; 
		cpReject = betDoc.counterpartyReject;  
		pendingIa = betDoc.pendingInitialApproval;  
		openBet = betDoc.openBet; 
		closedBet = betDoc.closedBet; 
		aTeAccept = betDoc.authorTeAccept; 
		cpTeAccept = betDoc.counterpartyTeAccept; 
		aValidation = betDoc.authorValidation; 
		cpValidation = betDoc.counterpartyValidation; 
		pendingTe = betDoc.pendingTe;
		pendingWinner = betDoc.pendingWinner; 
		winner = betDoc.winner; 

		if ( selectedAction === "acceptBet" && betDoc.counterpartyId.toString() === req.session.accountId) { 
		    cpAccept = true; 
		    pendingIa = false; 
		    openBet = true; 
		} 
		
		if ( selectedAction === "rejectBet" && betDoc.counterpartyId.toString() === req.session.accountId) { 
		    cpAccept = false;
		    pendingIa = false; 
		    closedBet = true; 
		} 
		
		/* 
		 * Implementation note: 
		 * --------------------
		 * 2 actions 
		 * 1. Set the appropriate field (authorTeAccept / counterpartyTeAccept ) 
		 *    to true depending on the current user
		 * 2. If one party has already triggered termination, close the bet 
		 * 
		 */ 


		if ( selectedAction === "acceptTe" && betDoc.openBet === true ) {
		    if ( !betDoc.pendingTe ) { 
			pendingTe = true; 
			if ( curUserIsAuthor ){ 
			    aTeAccept = true;
			} else { 
			    cpTeAccept = true; 
			}
		    } else if ( betDoc.pendingTe ) { 
			pendingTe = false; 
			closedBet = true; 
			openBet = false;
			if ( curUserIsAuthor ){ 
			    aTeAccept = true;
			} else { 
			    cpTeAccept = true; 
			}
		    }
		} 
		
		
		if ( selectedAction === "rejectTe" && betDoc.pendingTe === true ) { 
		    openBet = false; 
		    pendingTe = false; 
		    closedBet = true;
		    if ( curUserIsAuthor ){ 
			aTeAccept = false;
		    } else if ( curUserIsCp ){ 
			cpTeAccept = false; 
		    }
		}
		
		if ( selectedAction === "declareWinner" && betDoc.openBet === true ) { 
		    if ( !betDoc.pendingWinner && (curUserIsAuthor || curUserIsCp) ) { 
			
			console.log('~/routes/accounts | declareWinner | winner ' + req.param('winner') ); 

			var winnerId; 
			if ( req.param('winner') === betDoc.authorName ) { 
			    winnerId = betDoc.authorId; 
			} else if ( req.param('winner') === betDoc.counterpartyName ) { 
			    winnerId = betDoc.counterpartyId; 
			} 
			
			winner = winnerId;  
			pendingWinner = true; 

			if ( curUserIsAuthor ) {
			    aValidation = true;
			} else { 
			    cpValidation = true; 
			}

		    }
		}
		
		
		if ( selectedAction === "acceptWinner" ) {
		    var authorWin = betDoc.winner.toString() === betDoc.authorId.toString() ? true : false; 
		    var winnerName = authorWin ? betDoc.authorName : betDoc.counterpartyName;
		    var loserName = authorWin ? betDoc.counterpartyName : betDoc.authorName; 
		    var amountWon = authorWin ? betDoc.counterpartyBet : betDoc.authorBet; 


		    var updateWinner = function( acctDoc, bet ) {
			acctDoc.numCompleteBets += 1; 
			acctDoc.numWinningBets += 1;  
			acctDoc.winningPercentage = acctDoc.numWinningBets/acctDoc.numCompleteBets;
			acctDoc.accountBal += bet;  
			acctDoc.save();
		    };
			
    		    var updateLoser = function( acctDoc, bet ) {
			acctDoc.numCompleteBets += 1; 
			acctDoc.winningPercentage = acctDoc.numWinningBets/acctDoc.numCompleteBets;
			acctDoc.accountBal -= bet;  
			acctDoc.save();
		    }

		    models.Account.findByString( winnerName, amountWon, updateWinner ); 
		    models.Account.findByString( loserName, amountWon, updateLoser ); 

		    if ( betDoc.pendingWinner && curUserIsAuthor && !betDoc.authorValidation ){ 
			aValidation = true;
			openBet = false; 
			closedBet = true;
			pendingWinner = false; 
		    } 
		    
		    if ( betDoc.pendingWinner && curUserIsCp && !betDoc.counterpartyValidation )  { 
			cpValidation = true;
			openBet = false; 
			closedBet = true;
			pendingWinner = false; 
		    }
		}
     		
		if( selectedAction === "rejectWinner" ){ 
		    //TODO: CODE HERE
		    if ( betDoc.pendingWinner ) { 
			openBet = false; 
			closedBet = true;
			pendingWinner = false; 
		    }
		  
		}



		models.Account.findByIdAndUpdateBet(betId, 
						    {$set:{counterpartyAccept: cpAccept, 
							   counterpartyReject: cpReject, 
							   pendingInitialApproval: pendingIa,
							   pendingTe: pendingTe, 
							   pendingWinner: pendingWinner, 
							   openBet: openBet, 
							   closedBet: closedBet,
							   authorTeAccept: aTeAccept,
							   counterpartyTeAccept: cpTeAccept, 
							   authorValidation: aValidation,  
							   counterpartyValidation: cpValidation, 
							   winner: winner
							  }}, 
						    function( bet ) {
							console.log('~/routes/accounts | post/bets/:id | callback' ); 	
						    });

	    
	  
	    }
	});  
	    
        //endpoint returns immediately
        res.send(200) 
	
    });



 
}
