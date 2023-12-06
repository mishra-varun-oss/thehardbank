const path = require('path');
const mysql = require('mysql');

const configs = require(path.join(__dirname, "./configs.js"));

require('dotenv').config(configs.tools_config_obj);

const connection = mysql.createConnection({ 
	host: process.env.MYSQL_HOSTNAME,
	user: process.env.MYSQL_HARDBANK_USERNAME,
	password: process.env.MYSQL_HARDBANK_PASSWORD,
	database: 'the_hard_bank'
})

connection.connect((err) => {
	if (err) throw err;
	console.log(`thehardbank.com is connected to mysql!`);
})

module.exports = connection; 
