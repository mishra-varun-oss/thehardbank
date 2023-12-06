const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({ 
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../../public/uploads"))
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname.replace(/\s/g, '_'))
	}
})
const upload = multer({ storage: storage });

module.exports = upload;
