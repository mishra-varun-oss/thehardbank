const express = require('express')
const router = express.Router()

console.log('running bank.js')

router.get('/',(req,res) => {
	if(session.userid){
		res.render('bank',{identity:req.session.userid, role:req.session.role});
	}else{
		res.send('You have not been validated');
	}
})


router.get('/exit', (req,res) => {
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;
