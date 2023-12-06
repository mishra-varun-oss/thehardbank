const places_tbody = document.querySelector('#places');

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

function delete_place(id) {
	post('/manage/office/place/delete', { id: id })
	.then((data) => {
		if (data.success) {
			location.reload();
		}
	})
}

function submit_room(id) {
	let office_name = document.querySelector('#name').value;
	let room_name = document.querySelector(`#${id}`).value;
	post('/manage/office/add_room', { office: office_name, room: room_name })
	.then((data) => {
		if (data.success) {
			location.reload();
		}
	})	
}

function add_room() {
	let row_length = places_tbody.rows.length;
	let row = places_tbody.insertRow(row_length - 1);
	
	let c1 = row.insertCell(0);
	let room_name_input = document.createElement('input');
	let id = makeid(7);
	room_name_input.id = id; 
	c1.appendChild(room_name_input);

	let c2 = row.insertCell(1);
	let submit_room_button = document.createElement('button');
	let submit_room_button_text = document.createTextNode('Submit');
	submit_room_button.appendChild(submit_room_button_text);
	submit_room_button.addEventListener('click', () => { submit_room(id) });
	c2.appendChild(submit_room_button);
}
window.onload = () => {
	let id = document.querySelector("#id").value;
	fetch(`https://thehardbank.com/manage/office/get_maps?id=${id}`, { headers: { "Content-Type": "application/pdf" } })
	.then(response => response.json())
	.then((data) => {
		if (data.status) {
			data.maps.forEach((map) => {
				let embed = document.createElement('embed');
				embed.src = `/maps/${map}`;
				embed.type = "application/pdf";
				document.querySelector("#maps").appendChild(embed);
			})
		}
	})
}
