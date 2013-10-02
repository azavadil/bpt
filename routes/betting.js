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


	if ( null == counterparty || counterparty.length < 1
	     || null == betDescription || betDescription.length < 1 
	     || null == referenceIndex || referenceIndex.length < 1
	     || null == authorBet || authorBet.length < 1
	     || null == counterpartyBet || couterpartyBet.length < 1 ) 
	{
	    res.send(400);
	    return;
	}

	models.Account.findByString( counterparty, function onSearchDone( err, cpAccount ){ 
	    if( err || cpAccount.length != 1 ){ 
		res.send( 404 ); 
	    } else { 
		console.log('~/routes/betting.js | findByString' + account._id); 
		
		models.Account.findById( accountId, function( account ) { 
		    
		    var counterpartyId = cpAccount._id; 

		    //need to notify counterparty, should be real time
		    
		    var betProperties = { 
			accountId: accountId, 
			conterpartyId: counterpartyId,  
			betDescription: betDescription, 
			referenceIndex: referenceIndex, 
			terminationEvent: terminationEvent, 
			authorBet: authorBet, 
			counterpartyBet: counterpartyBet
		    }; 
		    
		    models.Account.placeBet(account, betProperties);
		    models.Account.placeBet(cpAccount, betProperties); 
		}); 
	    }
	}); 

	res.send(200);
    });

 
}
