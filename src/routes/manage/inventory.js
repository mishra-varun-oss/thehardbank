const fs = require('fs');
const path = require('path');
const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const db = require(path.join(__dirname, "../../tools/db.js"));
const login_check = require(path.join(__dirname, "../../middleware/login.js"));
const tools = require(path.join(__dirname, "../../tools/tools.js"));
const upload = require(path.join(__dirname, "../../tools/storage.js"));

/*
router.post('/scan', (req, res) => {
	console.log(req.body);
	res.status(200).send(`id: ${req.body.code}`);
})
*/

router.use(login_check.login_check);
router.get('/', (req, res) => {
	let items = [];
	let q = `SELECT * FROM inventory_2 ORDER BY unit, shelf ASC`;
	db.query(q, (err, results) => {
		if (err) throw err;
		results.forEach((r) => {
			let obj = {
				id: r.id,
				name: r.name,
				quantity: r.quantity, 
				category: r.category,
				unit: r.unit,
				shelf: r.shelf
			}
			items.push(obj);
		})
		res.render('manage_inventory', { 
			username: req.session.username,
			item: items
		});
	})
})
router.get('/add', (req, res) => {
	let q = `SELECT * FROM offices`;
	db.query(q, (err, results) => {
		if (err) throw err;

		res.render('add_inventory', { 
			username: req.session.username,
			office: results
		})
	})
})

router.post('/add', upload.array('fileInput'), (req, res) => {
	let current_dt = tools.get_current_date_time();
	let shelf;
	if (req.body.shelf) {
		shelf = req.body.shelf;
	} else {
		shelf = null;
	}
	let files_list = [];
	req.files.forEach((file) => {
		let uid = tools.random_string_generator(10);
		let old_path = path.join(__dirname, `../../../public/uploads/${file.originalname.replace(/\s/g, "_")}`);
		let new_path = path.join(__dirname, `../../../public/images/${uid}`);
		files_list.push(uid);
		fs.rename(old_path, new_path, (error) => {
			if (error) throw error;
		})
	})
	let q = `INSERT INTO inventory_2 VALUES (default, '${req.body.name}', ${req.body.quantity}, '${req.body.category}', '${req.body.office}', '${req.body.place}', '${current_dt}', '${req.body.unit}', ${shelf}, '${files_list.join(';;')}')`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ status: true, url: 'https://thehardbank.com/manage/inventory/add' });
	})
})

router.get('/view/:id', (req, res) => {
	let id = req.params.id;
	let q = `SELECT * FROM inventory_2 WHERE id = ${id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		if (results.length > 0) {
			res.render("view_inventory", {
				username: req.session.username,
				id: results[0].id,
				image: results[0].file_ids,
				name: results[0].name,
				quantity: results[0].quantity,
				category: results[0].category,
				unit: results[0].unit,
				shelf: results[0].shelf,
				location: results[0].location,
				place: results[0].place
			})
		} else {
			res.redirect('/manage/inventory');
		}
	})
})

router.get('/delete/:id', (req, res) => {
	let q = `DELETE FROM inventory_2 WHERE id = ${req.params.id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.redirect('/manage/inventory');
	})
})

router.post('/update_image', upload.single('fileInput'), (req, res) => {
	let replace_file = req.body.replace_file;	
	old_path = path.join(__dirname, `../../../public/uploads/${req.file.originalname.replace(/\s/g, "_")}`);
	new_path = path.join(__dirname, `../../../public/images/${replace_file}`);
	fs.rename(old_path, new_path, (err) => {
		res.redirect(`/manage/inventory/view/${req.body.id}`);
	})
/*
	let q = `SELECT file_ids FROM inventory_2 WHERE id = ${req.body.id}`; 
	let new_path, old_path;
	db.query(q, (err, results) => {
		if (err) throw err;
		console.log(results);
		if (results[0].file_ids != '') {
			let name = results[0].file_ids;
			console.log('old', name);
		} else {
			console.log('new');
			let uid = tools.random_string_generator(10);
			old_path = `/var/www/new_thehardbank.com/public/uploads/${req.file.originalname.replace(/\s/g, "_")}`;
			new_path = `/var/www/new_thehardbank.com/public/images/${uid}`;
			fs.rename(old_path, new_path, () => {
				let q = `UPDATE inventory_2 SET file_ids = '${uid}' WHERE id = ${req.body.id}`;
				db.query(q, (err, results) => {
					if (err) throw err;
					res.redirect(`/manage/inventory/view/${req.body.id}`);
				})
			})
		}
	})
*/
})

router.post('/add_image', upload.single('fileInput'), (req, res) => {
	let uid = tools.random_string_generator(10);
	console.log(req.file);
	let old_path = req.file.path;
	let new_path = path.join(__dirname, `../../../public/images/${uid}`);
	fs.rename(old_path, new_path, () => {		
		let q = `SELECT file_ids FROM inventory_2 WHERE id = ${req.body.id}`;
		db.query(q, (err, results) => {
			if (err) throw err;
			if (results[0].file_ids.length < 88) {
				let new_files = results[0].file_ids + `;;${uid}`;
				q = `UPDATE inventory_2 SET file_ids = '${new_files}' WHERE id = ${req.body.id}`;
				db.query(q, (err, results) => {
					if (err) throw err;
					res.send({ status: true });
				})
			} else {
				res.send({ status: false, message: 'Max files!' });
			}
		})
	})
})
router.post('/delete_image', (req, res) => {
	let delete_path = path.join(`../../../public/images/${req.body.uid}`);
	fs.unlink(delete_path, (err) => {
		if (err) throw err;
		let q = `SELECT file_ids FROM inventory_2 WHERE id = ${req.body.id}`;
		db.query(q, (err, results) => {
			if (err) throw err;
			let file_ids = results[0].file_ids.split(';;');
			for (let i = 0; i < file_ids.length; i++) {
				if (file_ids[i] == req.body.uid) {
					file_ids.splice(i, 1);
				}
			}
			q = `UPDATE inventory_2 SET file_ids = '${file_ids.join(';;')}' WHERE id = ${req.body.id}`;
			db.query(q, (err, results) => {
				if (err) throw err;
				res.send({ status: true })
			})
		})
	})
})
router.post('/edit', (req, res) => {
	let id = req.body.id;
	let field = req.body.field;
	let value = req.body.value;
	let previous_value;
	if (field == 'unit') {
		let q = `SELECT unit FROM inventory_2 WHERE id = ${id}`;
		db.query(q, (err, results) => {
			if (err) throw err;
			if (results.length > 0) {
				previous_value = results[0].unit;
			}
		})
	}
	let q = `UPDATE inventory_2 SET ${field} = '${value}' WHERE id = ${id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ status: true, message: `${field} updated!`, previous_value: previous_value });
	})
})

router.post('/edit/quantity', (req, res) => {
	let id = req.body.id;
	let value = req.body.value;
	let q = `UPDATE inventory_2 SET quantity = ${value} WHERE id = ${id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ status: true, message: 'quantity updated!' });
	})
})

router.post('/edit/shelf', (req, res) => {
	let id = req.body.id;
	let value = req.body.value;
	let q = `UPDATE inventory_2 SET shelf = ${value} WHERE id = ${id}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ status: true, message: 'shelf updated!' });
	})
})

router.post('/search', (req, res) => {
	let category = req.body.category;
	let unit = req.body.unit;
	let shelf = req.body.shelf;
	let q = `SELECT * FROM inventory_2 WHERE `;
	if (category.length > 0) {
		q += `category = '${category}' `;
		if (unit.length > 0) {
			q += `AND unit = '${unit}' `;
			if (shelf.length > 0) {
				q += `AND shelf = ${shelf}`;
			}
		} else {
			if (shelf.length > 0) {
				q += `AND shelf = ${shelf}`;
			}
		}
	} else {
		if (unit.length > 0) {
			q += `unit = '${unit}' `;
			if (shelf.length > 0) {
				q += `AND shelf = ${shelf}`;  
			} 
		} else {
			if (shelf.length > 0) {
				q += `shelf = ${shelf}`;
			} else {
				q = `SELECT * FROM inventory_2`;
			}
		}
	}
	db.query(q + ' ORDER BY unit, shelf ASC', (err, results) => {
		if (err) throw err;
		res.send({ status: true, results: results });
	})
})

router.post('/get_places', (req, res) => {
	let q = `SELECT * FROM places WHERE office = '${req.body.office}'`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ success: true, results: results })
	})	
})	

router.post('/get_units', (req, res) => {
	let q = `SELECT * FROM units WHERE place_name = '${req.body.place}'`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ success: true, results: results })
	})
})
router.post('/get_shelves', (req, res) => {
	let q = `SELECT * FROM units WHERE name = '${req.body.unit}'`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.send({ success: true, shelf_amount: results[0].shelf_amount })
	})
})
module.exports = router;
