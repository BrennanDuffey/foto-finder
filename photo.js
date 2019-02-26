class Photo {
  constructor(id, title, caption, file, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  }

  saveToStorage(photoArr) {
    localStorage.setItem('storedPhotos', JSON.stringify(photoArr))
  }

  updateContent(photoArr, index, targetId, targetInnerText) {
    if (targetId === 'card-title') {
      this.title = targetInnerText;
    } else if (targetId === 'card-caption') {
      this.caption = targetInnerText;
    } else if (targetId === 'fav-btn' && this.favorite === false) {
      this.favorite = true;
    } else if (targetId === 'fav-btn-active' && this.favorite === true) {
      this.favorite = false;
    }
    photoArr.splice(index, 1, this);
    localStorage.setItem("storedPhotos", JSON.stringify(photoArr))
  }

  deleteFromStorage(phototArr, index) {
    photoArr.splice(index, 1);
    localStorage.setItem('storedPhotos', JSON.stringify(photoArr))
  }
}