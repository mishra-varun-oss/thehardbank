const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('login');
})

router.post('/', (req, res) => {
	req.session.username = req.body.username;
	req.session.permission = req.body.permission;
	req.session.loggedin = true;

	if (req.body.permission == 'inventory') {
		res.send({ url: 'https://thehardbank.com/manage/inventory' });	
	} else if (req.body.permission == 'officer') {
		res.send({ url: 'https://thehardbank.com/manage/office' });	
	} else {
		res.send({ url: 'https://thehardbank.com/login' });
	}
})

module.exports = router;
