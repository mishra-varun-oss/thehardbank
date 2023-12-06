const mysql = require('mysql2');

const connection = mysql.createConnection({
	host:'192.168.152.3',
	user:'bank_clerk',
	password:'RJ.8yj>k-2vZb>@6',
	database:'the_hard_bank'
});

connection.connect((err)=>{
	if(err) throw err;
	console.log('Connected to mycivvi');
});

module.exports = connection;
