const db = require('./connect_thb.js');
const crypto = require('crypto')
const argon2 = require('argon2')

console.log('running key - service');

function hash_key(key){
	return new Promise((resolve,reject) => {
		try{
			let sha256 = crypto.createHash('sha256');
			let sha256_hash = sha256.update(key).digest('base64');
			argon2.hash(sha256_hash).then(hash=>{
				resolve(hash)
			})
		} catch (error){
			reject(error)
		}
	})
}
module.exports = {hash_key};

