document.addEventListener('DOMContentLoaded', () => {
  let file_data = document.querySelector("#file_data");
  const imageSources = file_data.value.split(';;');

  const mainImage = document.getElementById('mainImage');
  const filePreviews = document.getElementById('filePreviews');

  // Set the first image from the array as the main display image
  mainImage.src = `/images/${imageSources[0]}`;
  document.querySelector("#replace_file").value = imageSources[0];

  // Create clickable file previews and update the main display image on click
  imageSources.forEach((src) => {
    const previewImage = document.createElement('img');
    previewImage.src = `/images/${src}`;
    previewImage.alt = 'File Preview';
    previewImage.addEventListener('click', () => {
      mainImage.src = `/images/${src}`;
      document.querySelector("#replace_file").value = src;
    });
    filePreviews.appendChild(previewImage);
  });
});
