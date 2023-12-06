const express = require('express')
const path = require('path')

const crypto = require('crypto')
const argon2 = require('argon2')

//const patron = require('./routes/patron.js')
const bank = require('./routes/bank.js')

const app = express()
const body_parser = require('body-parser')
const port = 3011

const cookie_parser = require('cookie-parser');
const sessions = require('express-session');

let threeDays = 1000*60*60*24*3;
const view_directory_path = path.join(__dirname,'../templates/views');
const public_directory_path = path.join(__dirname,'../public');


app.set('view engine','hbs');
app.set('views',view_directory_path);


app.use(express.static(public_directory_path));
app.use(express.urlencoded({ extended: false }));

app.use(body_parser.urlencoded({extended:false}));

app.use(sessions({
	secret: "w<$4Nj^`J[U3N%/T",
	saveUninitialized:true,
	cookie:{maxAge: threeDays},
	resave: false
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie_parser());

//app.use('/patron',patron);
app.use('/bank',bank);

app.get('/', (req,res)=> {
	session = req.session;
	if (session.userid){
		res.redirect('/bank');
	}
	else{
		res.sendFile('/var/www/thehardbank.com/templates/views/index.html')
	}
})

app.get('/bank',(req,res) => {
	if(session.userid){
		res.render('bank',{identity:req.session.userid, role:req.session.role});
	}else{
		res.send('You have not been validated');
	}
})

app.listen(port, (err)=>{
	if (err) {
		console.error(err);
	}
	console.log(`The Hard Bank running on port:${port}`)
})
