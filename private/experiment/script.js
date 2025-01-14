const imageUpload = document.getElementById('image-upload');
const imagePreview = document.querySelector('.image-preview');

imageUpload.addEventListener('change', (e) => {
  const file = imageUpload.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const imageData = event.target.result;
    imagePreview.style.backgroundImage = `url(${imageData})`;
  };

  reader.readAsDataURL(file);
});