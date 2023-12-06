const first = document.querySelector("#first");
const second = document.querySelector("#second");
const unit_graphic = document.querySelector("#unit_graphic");
const shelf_graphic = document.querySelector("#shelf_graphic");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const closeBtn = document.getElementsByClassName("close")[0];
const file_input = document.querySelector("#fileInput");
const name_input = document.querySelector("#nameInput");
const quantity_input = document.querySelector("#quantityInput");
const cat_select = document.querySelector("#categorySelect");
const office_select = document.querySelector("#officeSelect");
const place_select = document.querySelector("#placeSelect");
const unit_select = document.querySelector("#unitSelect");
const shelf_select = document.querySelector("#shelfSelect");
let unit = document.querySelector("#unit");
let shelf = document.querySelector("#shelf");

second.style.display = "none";
place_select.disabled = true;
unit_select.disabled = true;
shelf_select.disabled = true;

async function post(url='', data={}) {
	const response = await fetch(url, {
		method: "POST", 
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
	return response.json();
}
function flip_section(number) {
	if (number == 1) {
		second.style.display = "block";
		first.style.display = "none";
	} else if (number == 2) {
		second.style.display = "none";
		first.style.display = "block";
	} else {
	}
}

function file_size_check(element) {
	if (element.files.length > 3) {
		alert("No more than 3 files");
		element.value = '';
	}
}

function set_unit(element) {
	unit.value = element.textContent;
	unit_graphic.textContent = unit.value;

	overlay.style.display = "block";
	modal.style.display = "block";
}

function set_shelf(element) {
	shelf.value = element.textContent;
	shelf_graphic.textContent = shelf.value;

  modal.style.display = "none";
  overlay.style.display = "none";
	
}

closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
  overlay.style.display = "none";
});

overlay.addEventListener("click", function() {
  modal.style.display = "none";
  overlay.style.display = "none";
});
office_select.addEventListener("change", () => {
	place_select.disabled = false;
	post('/manage/inventory/get_places', { office: office_select.value })
	.then((data) => {
		if (data.success) {
			data.results.forEach((result) => {
				let option = document.createElement('option');
				let option_text = document.createTextNode(result.name);
				option.appendChild(option_text);
				option.value = result.name;
				place_select.appendChild(option);
			})
		}
	})
})
place_select.addEventListener("change", () => {
	unit_select.disabled = false;
	post('/manage/inventory/get_units', { place: place_select.value })
	.then((data) => {
		if (data.success) {
			data.results.forEach((result) => {
				let option = document.createElement('option');
				let option_text = document.createTextNode(result.name);
				option.appendChild(option_text);
				option.value = result.name;
				unit_select.appendChild(option);
			})	
		}
	})
})
unit_select.addEventListener("change", () => {
	shelf_select.disabled = false;
	post('/manage/inventory/get_shelves', { unit: unit_select.value })
	.then((data) => {
		if (data.success) {
			for (let i = 0; i < data.shelf_amount; i++) {
				let option = document.createElement('option');
				let option_text = document.createTextNode(i);
				option.appendChild(option_text);
				option.value = i;
				shelf_select.appendChild(option);
			}
		}
	})
})	
/*
document.getElementById("myForm").addEventListener("submit", function(event) {
	event.preventDefault();  // Prevent form submission
	let formData = new FormData();
	for (let i = 0; i < file_input.files.length; i++) {
		formData.append("fileInput", file_input.files[i]);
	}
	
});*/
