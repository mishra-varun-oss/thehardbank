const container = document.querySelector("#map_container");
const inventory_id = document.querySelector("#inventory_id");
const unit_graphic = document.querySelector("#unit_graphic");
const shelf_graphic = document.querySelector("#shelf_graphic");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const closeBtn = document.getElementsByClassName("close")[0];
const map_control = document.querySelector("#map_control");
let unit = document.querySelector("#unit");
let shelf = document.querySelector("#shelf");

container.style.display = "none";

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

function set_unit(element) {
	if (document.querySelector("#unit").value === element.textContent) {
		console.log("helo");
		let numbers = document.querySelector("#numbers");
		overlay.style.display = "block";
		modal.style.display = "block";	
		for (let i = 0; i < numbers.children.length; i++) {
			if (numbers.children[i].textContent == document.querySelector("#shelf").value) {
				numbers.children[i].style.backgroundColor = "#f77205";
				numbers.children[i].style.color = "white";
			}
		}
	} else {
		document.querySelector("#unit").value = element.textContent;
		update_data(document.querySelector("#unit"), event); 
		overlay.style.display = "block";
		modal.style.display = "block";	
	}
}

function set_shelf(element) {
	document.querySelector("#shelf").value = element.textContent;

	  modal.style.display = "none";
	  overlay.style.display = "none";
	post('https://thehardbank.com/manage/inventory/edit/shelf', { id: document.querySelector("#id").value, value: document.querySelector("#shelf").value })
	.then((data) => {
		if (data.status) {

			let numbers = document.querySelector("#numbers");
			for (let i = 0; i < numbers.children.length; i++) {
				if (numbers.children[i].textContent == document.querySelector("#shelf").value) {
					numbers.children[i].style.backgroundColor = "#f77205";
					numbers.children[i].style.color = "white";
				} else {
					numbers.children[i].style.backgroundColor = "white";
					numbers.children[i].style.color = "black";
				}

			}
			document.querySelector("#message").textContent = data.message;
			setTimeout(() => { reset_message() }, 3000);
		}
	})
}

closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
  overlay.style.display = "none";
});

overlay.addEventListener("click", function() {
  modal.style.display = "none";
  overlay.style.display = "none";
});

map_control.addEventListener("click", () => {
	if (container.style.display == "none") {
		map_control.textContent = 'Close';
		container.style.display = "block";
		container.scrollIntoView();
	} else if (container.style.display == "block") {
		map_control.textContent = 'View Map';
		container.style.display = "none";
	} else {

	}
})
