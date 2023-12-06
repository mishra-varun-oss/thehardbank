const filter_button = document.querySelector("#filter_button");
const reset_button = document.querySelector("#reset_button");

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

function open_details(id) {
	window.location.href = `https://thehardbank.com/manage/inventory/view/${id}`;
}

filter_button.addEventListener("click", (e) => {
	let cat_select = document.querySelector("#category_select").value;
	let unit_input = document.querySelector("#unit_input").value.toUpperCase();
	let shelf_input = document.querySelector("#shelf_input").value;
	post('https://thehardbank.com/manage/inventory/search', { category: cat_select, unit: unit_input, shelf: shelf_input })
	.then((data) => {
		if (data.status) {
			if (data.results.length > 0) {
				let tbody = document.querySelector("#items");
				tbody.innerHTML = '';
				document.querySelector("table").style.display = "block";
				document.querySelector("#table_message").style.display = "none";
				reset_button.style.display = "block";
				for (let i = 0; i < data.results.length; i++) {
					let entry_row = document.createElement('tr');

					let name_td = document.createElement('td');
					let name_text = document.createTextNode(data.results[i].name);
					name_td.appendChild(name_text);

					let quantity_td = document.createElement('td');
					let quantity_text = document.createTextNode(data.results[i].quantity);
					quantity_td.appendChild(quantity_text);
					quantity_td.classList.add('center-text');

					let cat_td = document.createElement('td');
					let cat_text = document.createTextNode(data.results[i].category);
					cat_td.appendChild(cat_text);
					cat_td.classList.add('center-text');
					cat_td.classList.add('hide-mobile-view');

					let loc_td = document.createElement('td');
					let loc_text = document.createTextNode(`${data.results[i].unit}${data.results[i].shelf}`);
					loc_td.appendChild(loc_text);
					loc_td.classList.add('center-text');
/*
					let view_td = document.createElement('td');
					let view_link = document.createElement('a');
					let view_text = document.createTextNode('View');
					view_link.appendChild(view_text);
					view_link.href = `/manage/inventory/view/${data.results[i].id}`;
					view_link.classList.add('view_link');
					view_td.appendChild(view_link);
*/
					entry_row.appendChild(name_td);
					entry_row.appendChild(quantity_td);
					entry_row.appendChild(cat_td);
					entry_row.appendChild(loc_td);
					//entry_row.appendChild(view_td);
					entry_row.classList.add('entry_row');
					entry_row.addEventListener("click", () => { open_details(data.results[i].id) });

					tbody.appendChild(entry_row);
				}
			} else {
				document.querySelector("table").style.display = "none";
				document.querySelector("#table_message").style.display = "block";
				document.querySelector("#table_message").textContent = "No results!";
			}
		}
	})
})

reset_button.addEventListener("click", (e) => {
	e.preventDefault();
	location.reload();
})
