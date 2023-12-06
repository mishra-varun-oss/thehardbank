const db = require('./connect_thb.js');

function get_applicants(){
	return new Promise((resolve,reject) => {
		var sql = 'SELECT identity FROM applicants'
		db.query(sql, function(err,result){
			if(err){
				reject(err)
			}else{
				resolve(result)
			}
		})
	})
}
module.exports = {get_applicants};

