const accessor = require('./db_accessor.js');

accessor.get_applicants()
	.then(result => console.log('Got Results'+JSON.stringify(result)))
	.catch(error => console.log(JSON.stringify(error)))


