async function post(url = '', data = {}) {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
	return response.json();
}

function reset_message() {
	document.querySelector("#message").textContent = '';
}
function send_data(field, id, value) {
	post('https://thehardbank.com/manage/inventory/edit', { id: id, field: field, value: value })
	.then((data) => {
		if (data.status) {
			document.querySelector("#message").textContent = data.message;
			setTimeout(() => { reset_message() }, 3000);
			if (data.previous_value) {
				let button_map = document.querySelector("#button_map");
				for (let i = 0; i < button_map.children.length; i++) {
					if (button_map.children[i].textContent == data.previous_value) {
						button_map.children[i].style.backgroundColor = "#ddd";
						button_map.children[i].style.color = "black";
					} 
					if (button_map.children[i].textContent == value) {
						button_map.children[i].style.backgroundColor = "#f77205";
						button_map.children[i].style.color = "white";
					}
				}
				
			}
		}
	})
}

function update_data(element, e) {
	e.preventDefault();
	let field = element.id;
	let value = element.value;
	let id = document.querySelector("#id").value;	
	send_data(field, id, value);
}

function update_quantity() {
	let id = document.querySelector("#id").value;
	let value = document.querySelector("#quantity").value;
	post('https://thehardbank.com/manage/inventory/edit/quantity', { id: id, value: value })
	.then((data) => {
		if (data.status) {
			document.querySelector("#message").textContent = data.message;
			setTimeout(() => { reset_message() }, 3000);
		}
	})
}

function update_quantity_input(e) {
	e.preventDefault();
	update_quantity();
}


async function delete_entry() {
	let id = document.querySelector("#id").value;
	await fetch(`https://thehardbank.com/manage/inventory/delete/${id}`);
	window.location.href = 'https://thehardbank.com/manage/inventory';
}

function increase_quantity() {
	document.querySelector("#quantity").value++;
	update_quantity();
}

function decrease_quantity() {
	document.querySelector("#quantity").value--;
	if (document.querySelector("#quantity").value == 0) {
		delete_entry();
	} else {
		update_quantity();
	}
}
function truncate(str, n){
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};
window.onload = () => {
	let category_data = document.querySelector("#category_data").value;
	let category_select = document.querySelector("#category");
	for (let i = 0; i < category_select.options.length; i++) {
		if (category_select.options[i].value == category_data) {
			category_select.selectedIndex = i;
		}
	}

	let button_map = document.querySelector("#button_map");
	for (let i = 0; i < button_map.children.length; i++) {
		if (button_map.children[i].textContent == document.querySelector("#unit").value) {
			button_map.children[i].style.backgroundColor = "#f77205";
			button_map.children[i].style.color = "white";
		}
	}
}
document.querySelector("#fileInput").addEventListener("change", (e) => {
	e.preventDefault();
	let name = document.querySelector("#fileInput").files[0].name;
	if (name.length > 10) {
		let name_mod = truncate(name, 10);
		document.querySelector("#file_name").textContent = name_mod;
	} else {
		document.querySelector("#file_name").textContent = name;
	}
})
document.querySelector("#add_image").addEventListener("click", (e) => {
	e.preventDefault();
	let id = document.querySelector("#item_id").value;
	let formData = new FormData();
	formData.append('fileInput', document.querySelector("#fileInput").files[0]);
	formData.append('id', id);
	fetch('https://thehardbank.com/manage/inventory/add_image', {
		method: 'POST',
		body: formData
	})
	.then(response => response.json())
	.then((data) => {
		if (data.status) {
			location.reload();
		} else {
			document.querySelector("#message").textContent = data.message;
			setTimeout(() => { reset_message() }, 3000);
		}
	})
})
document.querySelector("#delete_image").addEventListener("click", (e) => {
	e.preventDefault();
	let file_name = document.querySelector("#replace_file").value;
	let id = document.querySelector("#item_id").value;
	post('https://thehardbank.com/manage/inventory/delete_image', { uid: file_name, id: id })
	.then((data) => {
		if (data.status) {
			location.reload();
		}
	})
})
