const key = require('./key.js')

key.hash_key('test')
	.then(result => console.log('Got Results'+JSON.stringify(result)))
	.catch(error => console.log(JSON.stringify(error)))
