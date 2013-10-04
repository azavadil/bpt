/** 
 * ~/routes/betting.js
 * --------------------------
 */ 




module.exports = function(app, models){ 

 
    app.post('/placebet', function(req, res) {
	

	
	var accountId = req.session.accountId; 
	var counterparty = req.param('counterparty', '');
	var betDescription = req.param('betDescription', null);
	var referenceIndex = req.param('referenceIndex', null); 
	var terminationEvent = req.param('terminationEvent', null);
	var authorBet = req.param('authorBet', null); 
	var counterpartyBet = req.param('counterpartyBet', null); 


	console.log(counterparty + ", " + 
		    betDescription + ", " +
		    referenceIndex + ", " + 
		    terminationEvent + ", " + 
		    authorBet + ", " + 
		    counterpartyBet); 
		    



	if ( null == counterparty || counterparty.length < 1
	     || null == betDescription || betDescription.length < 1 
	     || null == referenceIndex || referenceIndex.length < 1
	     || null == authorBet || authorBet.length < 1
	     || null == counterpartyBet || counterpartyBet.length < 1 ) 
	{
	    
	    console.log('~/routes/betting.js | bad form'); 
	    res.send(400);
	    return;
	}

	models.Account.findCounterparty( counterparty, function onSearchDone( cpAccount ){ 
	    
		    
	    if( !cpAccount ){

		console.log('~/routes/betting.js | bad counterparty'); 
		res.send( 404 ); 

	    } else { 

		console.log('~/routes/betting.js | findById | accountId: ' + accountId);
		console.log('~/routes/betting.js | findById | cpAccountId: ' + cpAccount._id); 
		
		models.Account.findById( accountId, function( account ) { 
		    
		    //need to notify counterparty, should be real time
		    
		    var betProperties = { 
			authorId: account._id,  
			counterpartyId: cpAccount._id,  
			authorName: account.username, 
			counterpartyName: cpAccount.username, 
			betDescription: betDescription, 
			referenceIndex: referenceIndex, 
			terminationEvent: terminationEvent, 
			authorBet: authorBet, 
			counterpartyBet: counterpartyBet
		    }; 
		    
		    models.Account.placeBet(account, betProperties);
		    models.Account.placeBet(cpAccount, betProperties); 
		    res.send(200);
		}); 
	    }
	}); 

	
    });

 
}
