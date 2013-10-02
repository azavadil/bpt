/** 
 * ~/routes/betting.js
 * --------------------------
 */ 




module.exports = function(app, models){ 

 
    app.post('/placebet', function(req, res) {
	



	var counterparty = req.param('counterparty', '');
	var betDescription = req.param('betDescription', null);
	var referenceIndex = req.param('referenceIndex', null); 
	var terminationEvent = req.param('terminationEvent', null);
	var authorBet = req.param('authorBet', null); 
	var counterpartyBet = req.param('counterpartyBet', null); 


	if ( null == email || email.length < 1
	     || null == password || password.length < 1 ) {
	    res.send(400);
	    return;
	}

	models.Account.placebet(counterparty, 
			       betDescription, 
			       referenceIndex, 
			       terminationEvent, 
			       authorBet, 
			       counterpartyBet);
	res.send(200);
    });

 
}
