module.exports = function(config, mongoose, nodemailer) {
    var crypto = require('crypto');




    var BetSchema = new mongoose.Schema({
      authorId: { type: mongoose.Schema.Types.ObjectId },
      counterpartyId: { type: mongoose.Schema.Types.ObjectId },
      authorName: { type: String }, 
      counterpartyName: { type: String }, 
      betDescription: { type: String }, 
      referenceIndex: { type: String }, 
      terminationEvent: {type: String }, 
      authorBet : { type: Number }, 
      counterpartyBet : { type: Number }, 
      counterpartyAccept: { type: Boolean },
      counterpartyReject: { type: Boolean }, 
      authorTeAccept: {type: Boolean }, 
      counterpartyTeAccept: {type: Boolean}, 
      authorValidation : { type: Boolean },  
      counterpartyValidation: { type: Boolean },
      pendingBet: {type: Boolean}, 
      openBet: {type: Boolean}, 
      closedBet: {type: Boolean}, 
      winner: {type: mongoose.Schema.ObjectId },
      added:     { type: Date },     // When the bet was added
      updated:   { type: Date }      // When the bet last updated
    });

    var AccountSchema = new mongoose.Schema({
	email:     { type: String },
	password:  { type: String },
	username: { type: String, unique: true }, 
	numCompleteBets : {type: Number }, 
	numWinningBets : {type: Number }, 
	winningPercentage : { type: Number }, 
	accountBal: { type: Number },       
	bets:  [mongoose.Schema.ObjectId]
    });

    var Account = mongoose.model('Account', AccountSchema);
    
    var Bet = mongoose.model('Bet', BetSchema); 
    
    
    var registerCallback = function(err) {
	if (err) {
	    return console.log(err);
	};
	return console.log('Account was created');
    };

    var changePassword = function(accountId, newpassword) {
	var shaSum = crypto.createHash('sha256');
	shaSum.update(newpassword);
	var hashedPassword = shaSum.digest('hex');
	Account.update({_id:accountId}, {$set: {password:hashedPassword}},{upsert:false},
		       function changePasswordCallback(err) {
			   console.log('Change password done for account ' + accountId);
		       });
    };

    var forgotPassword = function(email, resetPasswordUrl, callback) {
	var user = Account.findOne({email: email}, function findAccount(err, doc){
	    if (err) {
		// Email address is not a valid user
		callback(false);
	    } else {
		var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
		resetPasswordUrl += '?account=' + doc._id;
		smtpTransport.sendMail({
		    from: 'thisapp@example.com',
		    to: doc.email,
		    subject: 'SocialNet Password Request',
		    text: 'Click here to reset your password: ' + resetPasswordUrl
		}, function forgotPasswordResult(err) {
		    if (err) {
			callback(false);
		    } else {
			callback(true);
		    }
		});
	    }
	});
    };

    var login = function(email, password, callback) {
	var shaSum = crypto.createHash('sha256');
	shaSum.update(password);
	Account.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
	    callback(doc);
	});
    };

    var allBettors = function( callback ){ 
	Account.find({}, {"username": 1, "accountBal": 1, "winningPercentage": 1}).exec( callback ); 
    } ;

    var find20Bettors = function( blockNumber, callback ){ 
	var blockSize = 20; 
	Account.find({}, {"username": 1, "accountBal": 1, "winningPercentage": 1})
	    .limit(20)
	    .skip(blockSize*blockNumber)
	    .sort({"accountBal":-1})
	    .exec(callback); 
    };


    var findByString = function(searchStr, callback) {
	
	Account.findOne( { username: searchStr }, function(err, doc ){ 
	    if( err ) {
		console.log('error looking up name'); 
	    } else { 
		// code here callback
	    }
	});
    };

    var findCounterparty = function(searchStr, callback){


	Account.findOne({ username: searchStr}, function( err, doc ){
	    
	    
	    if( err ){ 
		console.log('~/models/Account.js | error looking up name');
		callback( false );
	    } else { 
		
		callback(doc); 
	    }
	}); 
    }; 


    var findById = function(accountId, callback) {
	Account.findOne({_id:accountId}, function(err,doc) {
	    callback(doc);
	});
    };

  
    var findBetById = function(betId, callback) {
	
	console.log('/models/Account/ | findBetById'); 

	Bet.findOne({ "_id": mongoose.Types.ObjectId( betId ) }, function(err,betDoc) {

	    callback( betDoc );
	});
    };

 
 
    var hasContact = function(account, contactId) {
	if ( null == account.contacts ) return false;

	account.contacts.forEach(function(contact) {
	    if ( contact.accountId == contactId ) {
		return true;
	    }
	});
	return false;
    };

    var register = function(username, email, password) {
	var shaSum = crypto.createHash('sha256');
	shaSum.update(password);

	console.log('Registering ' + email);
	var user = new Account({
	    username: username,
	    email: email,
	    password: shaSum.digest('hex'),      
	    numCompleteBets: 0, 
	    numWinningBets: 0, 
	    winningPercentage: 0, 
	    accountBal: 1000
	});
	user.save(registerCallback);
	console.log('Save command was sent');
    };

    var placeBet = function(account, cpAccount, betDetails){

	console.log('~/models/Account.js | placebet | authorId'); 
	
	var bet = new Bet({
	    authorId: betDetails.authorId, 
	    counterpartyId: betDetails.counterpartyId,
	    authorName: betDetails.authorName, 
	    counterpartyName: betDetails.counterpartyName, 
	    betDescription: betDetails.betDescription, 
	    referenceIndex: betDetails.referenceIndex, 
	    terminationEvent: betDetails.terminationEvent, 
	    authorBet: betDetails.authorBet, 
	    counterpartyBet: betDetails.counterpartyBet, 
	    counterpartyAccept: false,
	    counterpartyReject: false, 
	    authorTeAccept: false, 
	    counterpartyTeAccept: false, 
	    authorValidation: false, 
	    counterpartyValidation: false,
	    pendingBet: true,  
	    openBet: false, 
	    closedBet: false, 
	    winner: null, 
	    added: new Date(), 
	    updated: new Date()
	}); 

	bet.save( function( err ){ 
	    if( err ) { 
		console.log('Error saving bet: '+ err ); 
	    } 
	    
	    account.bets.push( bet._id ); 
	    account.save( function ( err ) { 
		if ( err ) { 
		    console.log('Error pushing bet to account and saving' + err); 
		}
	    }); 

	    cpAccount.bets.push( bet._id ); 
	    cpAccount.save( function ( err ) { 
		if ( err ) { 
		    console.log('Error pushing bet to cpAccount and saving' + err); 
		}
	    }); 

	    

	}); 
    }; 
		    
    var findByIdAndUpdateBet = function( betId, document, callback ) {
	
	console.log('~/public/models/Account.js | findByIdAndUpdateBet | betId: ' + betId); 
	
	Bet.findByIdAndUpdate( mongoose.Types.ObjectId(betId), document, callback); 
    }; 

			  

  return {
      findById: findById,
      findBetById: findBetById, 
      findByIdAndUpdateBet: findByIdAndUpdateBet, 
      findCounterparty: findCounterparty, 
      register: register,
      hasContact: hasContact,
      forgotPassword: forgotPassword,
      changePassword: changePassword,
      findByString: findByString,
      find20Bettors: find20Bettors,
      allBettors: allBettors, 
      placeBet: placeBet, 
      //addWager: addWager, 
      login: login,
      Account: Account
  }
}
