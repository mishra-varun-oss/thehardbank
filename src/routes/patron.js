const path = require('path');
const express = require('express')
const router = express.Router()

const patron_service = require(path.join(__dirname, '../services/patron_thb.js'));

const crypto = require('crypto')
const argon2 = require('argon2')

console.log('Running Patrons');

router.get('/application', (req,res)=> {
	res.render('application');
})


router.post('/approve', (req,res)=>{
	console.log('POST Approving');	
	res.send('POST Approved');
})

router.post('/submit_application', (req,res) => {

	let identity = req.body.identity;
	let key = req.body.key;
	let role = 'client';

	let sha256 = crypto.createHash('sha256')//HAD TO DO THIS BECAUSE OF DIGEST ALREADY CALLED ISSUE
	let sha256_hash = sha256.update(key).digest('base64');

	//hash_with_argon(sha256_hash,res,trial);
	argon2.hash(sha256_hash).then(hash=>{
		
		var sql = `INSERT INTO applicants (identity, hashed_key, role) VALUES ('${identity}','${hash}','${role}')`;
		console.log(sql);
		db.query(sql,function(err,result){
			if(err) throw err;
			console.log('added record');
			res.send('Your application has been received');
		});
	})

})

//TO Create a User 
//1 - Check if identity exists, if it does send admin to error
//3 - 
router.post('/create_user', (req,res)=>{
	let identity = req.body.identity;
	let key = req.body.key;
	
	let sha256 = crypto.createHash('sha256')//HAD TO DO THIS BECAUSE OF DIGEST ALREADY CALLED ISSUE
	let sha256_hash = sha256.update(key).digest('base64');

	//hash_with_argon(sha256_hash,res,trial);
	argon2.hash(sha256_hash).then(hash=>{
		
		var sql = `INSERT INTO patrons (identity, hashed_key) VALUES ('${identity}','${hash}')`;
		
		console.log(sql);
		db.query(sql,function(err,result){
			if(err) throw err;
			console.log('added record');
			res.send('Account created');
		});
	})


});



router.post('/validate_user', (req,res)=>{
	let identity = req.body.identity;
	let key = req.body.key;

	var sql = `SELECT hashed_key FROM patrons WHERE identity = '${identity}'`;

	let sha256 = crypto.createHash('sha256')//HAD TO DO THIS BECAUSE OF DIGEST ALREADY CALLED ISSUE
	let sha256_hash = sha256.update(key).digest('base64');

	db.query(sql, function(err,result){
		if(err) throw err;
		let hashed_key = result[0].hashed_key;
		console.log('Key:'+key);
		console.log('Hashed Key:'+hashed_key);
		
		argon2.verify(hashed_key,sha256_hash)
		.then((correct)=>{
			session = req.session;
			session.userid = req.body.identity;
			res.redirect('/');
			console.log(correct);
		})	
	})
})
	
	

router.get('/validate',(req,res)=> {
	
	let identitiy = req.body.identity;
	let key = req.body.key;

	if(req.session.userid){
		res.redirect('/bank');
	}else{
		res.render('validate');
	}	

})


router.post('/validate_user', (req,res)=>{
	let identity = req.body.identity;
	let key = req.body.key;

	var sql = `SELECT hashed_key,role FROM patrons WHERE identity = '${identity}'`;

	let sha256 = crypto.createHash('sha256')//HAD TO DO THIS BECAUSE OF DIGEST ALREADY CALLED ISSUE
	let sha256_hash = sha256.update(key).digest('base64');

	db.query(sql, function(err,result){
		if(err) throw err;
		console.log('MYSQL Patrons Data: ' + result[0]);
		let hashed_key = result[0].hashed_key;
		let role = result[0].role;
		console.log('Key:'+key);
		console.log('Hashed Key:'+hashed_key);
		
		argon2.verify(hashed_key,sha256_hash)
		.then((correct)=>{
			session = req.session;
			session.userid = req.body.identity;
			session.role = role;
			res.redirect('/bank');
			console.log(correct);
		})	
	})
	
	
});

module.exports = router;
