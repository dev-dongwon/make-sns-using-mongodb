const SettingsHandler = class {
  constructor() {
    this.completeBtn = document.getElementById('btn-settings');
    this.infoModal = document.getElementById('content-modal');
    this.locationInput = document.getElementById('input-location');
    this.bioInput = document.getElementById('input-bio');
    this.linkInput = document.getElementById('input-link');
    this.userIdentifier = document.getElementById('input-user-origin-identifier');
    this.previewArea = document.getElementsByClassName('settings-profile-image-preview')[0];
    this.closeModal = document.getElementById('modal-btn-no');
    this.excuteDeleteBtn = document.getElementById('modal-btn-yes');

 }

 async updateUserInfoEvent(event) {

  const data = new FormData();
  const image = document.getElementById('post-image-btn').files[0];
  const location = this.locationInput.value;
  const bio = this.bioInput.value;
  const link = this.linkInput.value;
  
  data.set('image', image);
  data.set('location', location);
  data.set('bio', bio);
  data.set('link', link);

  const result = await this.ajax().updateUserInfoAjax(data);
  return result;
}

  addChangeInputEvent() {
    const files = document.getElementById('post-image-btn');
    files.addEventListener('change', (event) => {
      this.handleFiles(event.target.files);
    })
  }

  makeImgNode(file, reader) {
    const img = document.createElement("img");
    img.classList.add("preview");
    img.file = file;
    img.src = reader.result;
    return img;
  }

  handleFiles(files) {
    this.previewArea.style.display = 'block';
    for (let i=0; i < files.length; i++) {
      const file = files[i];
      const imageType = /image.*/;

      if (!file.type.match(imageType)) {
        alert('이미지 파일만 업로드가 가능합니다!');
        continue;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        let img = this.makeImgNode(file, reader);

        const tempImage = new Image();
        tempImage.src = reader.result;

        this.previewArea.innerHTML = '';
        this.previewArea.appendChild(img);
      }
    }
  }

  addUpdateUserInfoEvent() {
    this.completeBtn.addEventListener('click', async (event) => {
      const result = await this.updateUserInfoEvent(event);
      if (result === 'success') {
        location.href = `/profile/${this.userIdentifier.value}`
        return;
      }
    })
  }

  addDeleteUserEvent() {
    const deleteBtn = document.getElementsByClassName('settings-profile-delete-btn')[0];
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (event) => {
        this.infoModal.style.display = "block";
        this.addExecuteDeleteUserEvent();
      })
    }
  }

  addCloseModalEvent() {
    this.closeModal.addEventListener('click', () => {
      this.infoModal.style.display = "none";
    })
  }

  addExecuteDeleteUserEvent() {
    this.excuteDeleteBtn.addEventListener('click', async () => {
      const result = await this.ajax().deleteUserAjax();
      if (result === 'success') {
        alert('GOODBYE, SEEYA');
        location.href = '/';
      }
    })
  }

  ajax() {
    const updateUserInfoAjax = async (userInfoObj) => {
      const url = `/users/${this.userIdentifier.value}`;
      const response = await fetch(url, {
        method : 'PATCH',
        body : userInfoObj
      })
      return await response.text();
    }

    const deleteUserAjax = async () => {
      const url = `/users/${this.userIdentifier.value}`;
      const response = await fetch(url, {
        method : 'DELETE',
      })
      return await response.text();
    }

    return {
      updateUserInfoAjax,
      deleteUserAjax
    }
  }

  run() {
    this.addUpdateUserInfoEvent();
    this.addChangeInputEvent();
    this.addDeleteUserEvent();
  }
}

window.addEventListener('load', (event) => {
  const settingsHandler= new SettingsHandler();
  settingsHandler.run();
});