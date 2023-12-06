module.exports.random_string_generator = (length) => {
	let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

module.exports.get_current_date_time = () => {
	let currentdate = new Date(); 
	let datetime = currentdate.getFullYear() + "-"
			+ (currentdate.getMonth()+1)  + "-" 
			+ currentdate.getDate() + " "  
			+ currentdate.getHours() + ":"  
			+ currentdate.getMinutes()  + ":" 
			+ currentdate.getSeconds();
	return datetime;
}
