const unit_tbody = document.querySelector("#units");
const place_name = document.querySelector("#place_name").value;

async function post(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	return response.json();
}
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
function submit_unit(unit_id, shelf_id, file_id) {
	let form_data = new FormData();
	let unit_input = document.querySelector(`#${unit_id}`).value;
	let shelf_input = document.querySelector(`#${shelf_id}`).value;
	let file_input = document.querySelector(`#${file_id}`);

	form_data.append("file", file_input.files[0]);
	form_data.append("unit_name", unit_input);
	form_data.append("shelf_amount", shelf_input);
	form_data.append("place_name", place_name);
	console.log(...form_data);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				console.log('success');
				location.reload();
			} else {
				console.log('error');
			}
		}
	};
	xhr.open('POST','/manage/office/add_unit',true);
	xhr.send(form_data);
}
function add_unit() {
	let row_length = unit_tbody.rows.length;
	let row = unit_tbody.insertRow(row_length - 1);
	
	let c1 = row.insertCell(0);
	let unit_name_input = document.createElement('input');
	let unit_id = makeid(7);
	unit_name_input.id = unit_id; 
	c1.appendChild(unit_name_input);

	let c2 = row.insertCell(1);
	let shelf_amount_input = document.createElement('input');
	let shelf_id = makeid(7);
	shelf_amount_input.id = shelf_id;
	c2.appendChild(shelf_amount_input);

	let c3 = row.insertCell(2);
	let file_input = document.createElement('input');
	let file_id = makeid(7);
	file_input.type = 'file';
	file_input.id = file_id;
	c3.appendChild(file_input);
	

	let c4 = row.insertCell(3);
	let submit_unit_button = document.createElement('button');
	let submit_unit_button_text = document.createTextNode('Submit');
	submit_unit_button.appendChild(submit_unit_button_text);
	submit_unit_button.addEventListener('click', () => { submit_unit(unit_id, shelf_id, file_id) });
	c4.appendChild(submit_unit_button);
}
function delete_unit(id) {
	post('/manage/office/delete_unit', { id: id })
	.then((data) => {
		if (data.success) {
			location.reload();
		}
	})	
}
function view_shelf_image(pic_id) {
	document.querySelector(`#img${pic_id}`).style.display = "block";
}
function close_picture(pic_id) {
	document.querySelector(`#img${pic_id}`).style.display = "none";
}
