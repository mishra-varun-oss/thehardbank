const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

const db = require(path.join(__dirname, "../../tools/db.js"));
const login_check = require(path.join(__dirname, "../../middleware/login.js"));
const upload = require(path.join(__dirname, "../../tools/storage.js"));
const tools = require(path.join(__dirname, "../../tools/tools.js"));

router.use(login_check.login_check);

router.get('/', (req, res) => {
	let q = `SELECT * FROM offices`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.render('offices', { 
			username: req.session.username,
			office: results
		})
	})
})

router.get('/add', (req, res) => {
	res.render('add_office', { username: req.session.username })
})

router.post('/add', upload.array('map_upload'), (req, res) => {
	let files_list = [];
	req.files.forEach((file) => {
		let uid = tools.random_string_generator(10);
		let old_path = path.join(__dirname, `../../../public/uploads/${file.originalname.replace(/\s/g, "_")}`);
		let new_path = path.join(__dirname, `../../../public/maps/${uid}`);
		files_list.push(uid);
		fs.rename(old_path, new_path, (error) => {
			if (error) throw error;
		})
	})
	let q = `INSERT INTO offices VALUES (default, '${req.body.name}', '${req.body.street}', '${req.body.city}', '${req.body.state}', '${req.body.postal_code}', '${files_list.join(';;')}')`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.redirect('/manage/office/add');
	})
})

router.get('/view/:id', (req, res) => {
	let id = req.params.id;
	let q = `SELECT * FROM offices WHERE id = ${id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		let r = results[0];
		let q = `SELECT * FROM places WHERE office = '${r.name}'`;
		db.query(q, (err, results) => {
			if (err) throw err;
			res.render('view_office', {
				username: req.session.username,
				id: r.id,
				name: r.name,
				street: r.street,
				city: r.city,
				state: r.state,
				postal_code: r.postal_code,
				place: results
			})
		})
	})
})

router.get('/delete/:id', (req, res) => {
	let id = req.params.id;
	let q = `DELETE FROM offices WHERE id = ${id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.redirect('/manage/offices');
	})
})

router.post('/view', (req, res) => {
	let r = req.body;
	let q = `UPDATE offices SET name = '${r.name}', street = '${r.street}', city = '${r.city}', state = '${r.state}', postal_code = '${r.postal_code}' WHERE id = ${r.id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.redirect(`/manage/office/view/${r.id}`);
	})
})

router.get('/get_maps', (req, res) => {
	let id = req.query.id;
	let q = `SELECT map FROM offices WHERE id = ${id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		let maps = results[0].map.split(';;');
		res.send({ status: true, maps: maps })
	})
})

router.post('/place/delete', (req, res) => {
	let q = `DELETE FROM places WHERE id = ${req.body.id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ success: true });
	})
})
router.post('/add_room', (req, res) => {
	let q = `INSERT INTO places VALUES (default, '${req.body.room}', '${req.body.office}', '')`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ success: true })
	})
})	

router.post('/place/add_map', upload.single('file'), (req, res) => {
	let uid = tools.random_string_generator(10);
	let old_path = path.join(__dirname, `../../../public/uploads/${req.file.originalname.replace(/\s/g, "_")}`);
	let new_path = path.join(__dirname, `../../../public/maps/${uid}`);
	fs.rename(old_path, new_path, (err) => {
		if (err) throw err;
		let q = `UPDATE places SET map = '${uid}' WHERE id = ${req.body.id}`
		db.query(q, (err, results) => {
			if (err) throw err;
			res.redirect(`/manage/office/place/${req.body.id}`);
		})
	})
})

router.get('/place/:id', (req, res) => {
	let q = `SELECT * FROM places WHERE id = ${req.params.id}`;
	db.query(q, (err, place_results) => {
		if (err) throw err;
		let q = `SELECT * FROM units WHERE place_name = '${place_results[0].name}'`;
		db.query(q, (err, unit_results) => {
			if (err) throw err;
			res.render('view_place', {
				username: req.session.username,
				place: place_results,
				unit: unit_results
			})
		})
	})
})

router.post('/add_unit', upload.single('file'), (req, res) => {
	if (req.file) {
		let uid = tools.random_string_generator(10);
		let old_path = path.join(__dirname, `../../../public/uploads/${req.file.originalname.replace(/\s/g, "_")}`);
		let new_path = path.join(__dirname, `../../../public/shelf_pictures/${uid}`);
		fs.rename(old_path, new_path, (err) => {
			if (err) throw err;
			let q = `INSERT INTO units VALUES (default, '${req.body.unit_name}', ${req.body.shelf_amount}, '${req.body.place_name}', '${uid}')`; 
			db.query(q, (err, results) => {
				if (err) throw err;
				res.send({ success: true })
			})
		})
	} else {
		let q = `INSERT INTO units VALUES (default, '${req.body.unit_name}', ${req.body.shelf_amount}, '${req.body.place_name}', '')`; 
		db.query(q, (err, results) => {
			if (err) throw err;
			res.send({ success: true })
		})
	}
})

router.post('/delete_unit', (req, res) => {
	let id = req.body.id;
	let q = `DELETE FROM units WHERE id = ${id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ success: true })
	})
})

module.exports = router;

