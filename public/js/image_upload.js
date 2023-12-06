document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const previewContainer = document.getElementById('previewContainer');
  const form = document.querySelector("#myForm");
  const message = document.querySelector("#form_message");

  message.style.display = "none";

  fileInput.addEventListener('change', (event) => {
    previewContainer.innerHTML = ''; // Clear existing previews
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 8) {
	    message.style.display = "block";
	    message.textContent = "Max 8 images allowed!";
    } else {
	    message.style.display = "none";
	    Array.from(files).forEach((file) => {
	      const reader = new FileReader();

	      reader.onload = (e) => {
		const imageSrc = e.target.result;
		const previewImage = document.createElement('img');
		previewImage.src = imageSrc;
		previewImage.classList.add('previewImage');
		previewContainer.appendChild(previewImage);
	      };
	      reader.readAsDataURL(file);
	    });
	    document.querySelector("#image_label").textContent = `Selected ${files.length} images`;
    }
  });

  form.addEventListener("submit", (e) => {
	  e.preventDefault();
	  let formData = new FormData();
	  for (let i = 0; i < document.querySelector("#fileInput").files.length; i++) {
		  formData.append("fileInput", document.querySelector("#fileInput").files[i]);
	  }
	  formData.append("name", document.querySelector("#nameInput").value);
	  formData.append("quantity", document.querySelector("#quantityInput").value);
	  formData.append("category", document.querySelector("#categorySelect").value);
	  formData.append("office", document.querySelector("#officeSelect").value);
	  formData.append("place", document.querySelector("#placeSelect").value);
	  formData.append("unit", document.querySelector("#unitSelect").value);
	  formData.append("shelf", document.querySelector("#shelfSelect").value);

	  const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        progressBar.style.width = percentComplete + '%';
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
		let res = JSON.parse(xhr.response);
		if (res.status) {
			window.location.href = res.url;
		}	
        } else {
          console.error('Request failed!');
        }

        // Hide the progress bar after the request is completed
      //  progressBarContainer.style.display = 'none';
      }
    };

    xhr.open('POST', '/manage/inventory/add');
    xhr.send(formData);

    // Show the progress bar
    progressBarContainer.style.display = 'flex';
  })
});

