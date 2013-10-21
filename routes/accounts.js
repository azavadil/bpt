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
	    
	    if ( betDoc.counterpartyId.toString() === req.session.accountId || 
	         betDoc.authorId.toString() === req.session.accountId ) { 
 		
		console.log('~/routes/accounts | post/bets/:id | betDoc.authorId, req.session | conditional' ); 

		var betId = req.params.id; 
	    
		var selectedAction = req.param('selectedAction');

		var cpAccept, cpReject, pendingBet, openBet,closedBet, aTeAccept, cpTeAccept, aValidation, cpValidation; 
		cpAccept = betDoc.counterpartyAccept; 
		cpReject = betDoc.counterpartyReject;  
		pendingBet = betDoc.pendingBet;  
		openBet = betDoc.openBet; 
		closedBet = betDoc.closedBet; 
		aTeAccept = betDoc.authorTeAccept; 
		cpTeAccept = betDoc.counterpartyTeAccept; 
		aValidation = betDoc.authorValidation; 
		cpValidation = betDoc.counterpartyValidation; 

		if ( selectedAction === "acceptBet" && betDoc.counterpartyId.toString() === req.session.accountId) { 
		    cpAccept = true; 
		    pendingBet = false; 
		    openBet = true; 
		} 
		
		if ( selectedAction === "rejectBet" && betDoc.counterpartyId.toString() === req.session.accountId) { 
		    cpReject = true;
		    pendingBet = false; 
		    openBet = false;
		    closedBet = true; 
		} 
		
		if ( selectedAction === "acceptTe" && betDoc.openBet === true ) {
		    console.log('~/routes/accounts | post/bets/:id | betDoc.authorId, req.session.Id' ); 
		    if ( betDoc.authorId.toString() === req.session.accountId ){ 
			aTeAccept = true;
			if ( betDoc.counterpartyTeAccept ) {
			    closedBet = true; 
			    openBet = false; 
			}
		    } else if (betDoc.counterpartyId.toString() === req.session.accountId ) { 
			cpTeAccept = true;
			if ( betDoc.authorTeAccept ) { 
			    closedBet = true; 
			    openBet = false; 
			}
		    } 
		} 
		
		if ( selectedAction === "rejectTe" ) { 
		    if ( betDoc.authorId.toString() === req.session.accountId ){ 
			aTeAccept = true;
			openBet = true; 
		    } else { 
			cpTeAccept = true; 
			openBet = true;
		    }
		}
		
		if ( selectedAction === "declareWinner" ) { 
		    if ( !betDoc.authorValidation && !betDoc.counterpartyValidation ) { 
			 
			if ( (betDoc.authorId.toString() === req.session.accountId) || 
			      (betDoc.counterpartyId.toString() === req.session.accountId) ) { 
		             
			     if ( betDoc.authorId.toString() === req.session.accountId ) { 
				 aValidation = true;
			     } else { 
				 cpValidation = true; 
			     } 
			    
			    //TODO update betDoc.winner
			}
		    }
		} 
		
		if ( selectedAction === "acceptWinner" ) { 
		    var curUserIsAuthor, curUserIsCp; 
		    curUserIsAuthor = curUserIsCp = false; 
		    if ( betDoc.authorId.toString() === req.session.accountId ) { 
			curUserIsAuthor = true; 
		    }
		    if ( betDoc.counterpartyId.toString() === req.session.accountId ){ 
			curUserIsCp = true; 
		    }
		    if ( betDoc.authorValidation &&
			 !betDoc.counterpartyValidation && 
		    	 curUserIsCp ) { 
			cpValidation = true;
			openBet = false; 
			closedBet = true; 
			//TODO:UPDATE BETTING RECORD 
		    } 
		    
		    if ( betDoc.counterpartyValidation && 
			 !betDoc.authorValidation && 
			 curUserIsAuthor ) { 
			aValidation = true;
			openBet = false; 
			closedBet = true; 
		    }
		}
     		       

		models.Account.findByIdAndUpdateBet(betId, 
						    {$set:{counterpartyAccept: cpAccept, 
							   counterpartyReject: cpReject, 
							   pendingBet: pendingBet, 
							   openBet: openBet, 
							   closedBet: closedBet,
							   authorTeAccept: aTeAccept,
							   counterpartyTeAccept: cpTeAccept, 
							   authorValiation: aValidation,  
							   counterpartyValidation: cpValidation
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
