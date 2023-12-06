const path = require('path');
const express = require('express');
const hbs = require('hbs');
const session = require('express-session');
const body_parser = require('body-parser');

const app = express();

const public_directory = path.join(__dirname, "../public");
const views_directory = path.join(__dirname, "../templates/views");
const partials_directory = path.join(__dirname, "../templates/partials");

const login = require(path.join(__dirname, "./routes/login.js"));
const manage_inventory = require(path.join(__dirname, "./routes/manage/inventory.js"));
const manage_office = require(path.join(__dirname, "./routes/manage/office.js"));
const configs = require(path.join(__dirname, "./tools/configs.js"));

require('dotenv').config(configs.src_config_obj);

app.set('view engine', 'hbs');
app.set('views', views_directory);
hbs.registerPartials(partials_directory);

app.use('/maps/*', (req, res, next) => {
	console.log('hello!!');
	res.set('Content-Type', 'application/pdf');
	next();
})
app.use(express.static(public_directory));
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));

app.use('/login', login);
app.use('/manage/inventory', manage_inventory);
app.use('/manage/office', manage_office);

app.get('/', (req, res) => {
	res.send('the hard bank');
})

app.get('/manage/logout', (req, res) => {
	req.session.destroy();
	res.redirect('https://thehardbank.com/login?logout=true');
})

const port = process.env.PORT;
app.listen(port, (err) => {
	if (err) {
		console.log(err);
	}
	console.log(`thehardbank.com is up on port ${port}`);
})
