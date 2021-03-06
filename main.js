var searchInput = document.querySelector('#search-input');
var titleInput = document.querySelector('#title-input');
var captionInput = document.querySelector('#caption-input');
var photoInput = document.querySelector('#choose-file');
var favoriteFilterBtn = document.querySelector('#favorite-filter-btn');
var addToAlbumBtn = document.querySelector('#add-to-album-btn');
var photoGallery = document.querySelector('#photo-gallery');
var showMoreBtn = document.querySelector('#show-more-btn');
var numOfFavorites = document.querySelector('#num-of-favorites');
var inputSection = document.querySelector('.input-section');
var photoGalleryMessage = document.querySelector('#photo-gallery-message')
var photoArr = [];
var reader = new FileReader();

window.addEventListener('load', onLoad);
inputSection.addEventListener('input', disableAddPhotoBtn)
addToAlbumBtn.addEventListener('click', loadImg);
photoGallery.addEventListener('input', editCardText);
searchInput.addEventListener('input', search);
photoGallery.addEventListener('click', favAndDelete);
showMoreBtn.addEventListener('click', showMoreLessBtn);
favoriteFilterBtn.addEventListener('click', showFavorites);

function onLoad() {
  var storedArray = JSON.parse(localStorage.getItem('storedPhotos'));
  storedArray.forEach(obj => { 
    appendCard(obj)
    oldPhoto = new Photo(obj.id, obj.title, obj.caption, obj.file, obj.favorite)
    photoArr.push(oldPhoto)
  });
  showMoreOnLoad();
  disableAddPhotoBtn();
  updateFavoriteNumber();
  photoGalleryEmpty();
}

function addPhoto(e) {
  e.preventDefault();
  var newPhoto = new Photo(Date.now(), titleInput.value, captionInput.value, e.target.result)
  appendCard(newPhoto);
  photoArr.push(newPhoto);
  newPhoto.saveToStorage(photoArr);
}

function loadImg(e) {
  e.preventDefault();
  if (photoInput.files[0]) {
    reader.readAsDataURL(photoInput.files[0]); 
    reader.onload = addPhoto
  }
}

function appendCard(photo) {
  photoGallery.innerHTML = 
    `<article class="card" data-id=${photo.id}>
      <p contenteditable="true" id="card-title">${photo.title}</p>
      <img src=${photo.file}>
      <p contenteditable="true" id="card-caption" class="caption">${photo.caption}</p>
      <div class="fav-delete">
        <button class="delete-save-btns">
          <img src="images/delete.svg" id="delete-btn">
        </button>
        <button id="fav-btn-active" class="delete-save-btns favorite-btn">
          <img src="images/favorite.svg" id="fav-btn" class="fav-btn">
        </button>
      </div>
    </article>` + photoGallery.innerHTML;
  favoriteOnLoad(photo);
  photoGalleryEmpty();
}

function disableAddPhotoBtn() {
  if (titleInput.value === '' || captionInput.value === '' || photoInput.files.length == 0) {
    addToAlbumBtn.disabled = true;
  } else {
    addToAlbumBtn.disabled = false;
  }
}

function editCardText(e) {
  var card = e.target.closest('.card');
  var index = photoArr.findIndex(photo => photo.id === parseInt(card.dataset.id));
  photoArr[index].updateContent(photoArr, index, e.target.id, e.target.innerText);
}

function favAndDelete(e) {
  var card = e.target.closest('.card');
  var index = photoArr.findIndex(photo => photo.id === parseInt(card.dataset.id));
  if (e.target.id === 'delete-btn') {
    photoArr[index].deleteFromStorage(photoArr, index);
    e.target.closest('.card').remove();
    photoGalleryEmpty();
  } else if (e.target.id === 'fav-btn') {
    photoArr[index].updateContent(photoArr, index, e.target.id);
    updateFavoriteNumber();
    e.target.classList.add('hidden')
  } else if (e.target.id === 'fav-btn-active') {
    photoArr[index].updateContent(photoArr, index, e.target.id);
    updateFavoriteNumber();
    e.target.firstElementChild.classList.remove('hidden');
  }
}

function search() {
  var filterPhotos = photoArr.filter(photo => {
    return photo.caption.includes(searchInput.value) || photo.title.includes(searchInput.value)
  });
  photoGallery.innerHTML = '';
  filterPhotos.forEach(photo => appendCard(photo));
}

function showMoreOnLoad() {
  if (photoArr.length > 10) {
    showMoreBtn.classList.remove('start-hidden')
    var recentTen = photoArr.slice(-10);
    photoGallery.innerHTML = '';
    recentTen.forEach(photo => appendCard(photo));
  }
}

function showMoreLessBtn() {
  if (showMoreBtn.innerText === 'Show More...') {
    photoGallery.innerHTML = '';
    photoArr.forEach(photo => appendCard(photo));
    showMoreBtn.innerText = 'Show Less...';
  } else if (showMoreBtn.innerText === 'Show Less...') {
    photoGallery.innerHTML = '';
    var recentTen = photoArr.slice(-10);
    recentTen.forEach(photo => appendCard(photo));
    showMoreBtn.innerText = 'Show More...';
  }
}

function showFavorites(e) {
  e.preventDefault();
  var favoritePhotos = photoArr.filter(photo => photo.favorite === true);
  if (favoriteFilterBtn.innerText === 'View ' + favoritePhotos.length + ' Favorites') {
    photoGallery.innerHTML = '';
    favoriteFilterBtn.innerHTML = 'View All Photos';
    favoritePhotos.forEach(photo => appendCard(photo));    
  } else if (favoriteFilterBtn.innerText === 'View All Photos'){
    photoGallery.innerHTML = '';
    favoriteFilterBtn.innerHTML = `View <span id="num-of-favorites">0</span> Favorites`;
    numOfFavorites = document.querySelector('#num-of-favorites');
    photoArr.forEach(photo => appendCard(photo));
    updateFavoriteNumber();
  }
}

function updateFavoriteNumber() {
  var favoritePhotos = photoArr.filter(photo => photo.favorite === true);
  numOfFavorites.innerText = favoritePhotos.length
}

function favoriteOnLoad(photo) {
  var buttons = document.querySelectorAll('.fav-btn');
  if (photo.favorite === true) {
    buttons[0].classList.add('hidden');
  }
}

function photoGalleryEmpty() {
  if (photoGallery.innerHTML === '') {
    photoGalleryMessage.innerHTML = `<h1 id="empty-gallery-message">LET'S ADD SOME PHOTOS PLEASE OR DON'T</h1>`
  } else {
    photoGalleryMessage.innerHTML = ''
  }
}