const SettingsHandler = class {
  constructor() {
    this.completeBtn = document.getElementById('btn-settings');
    this.previewArea = document.getElementsByClassName('settings-profile-image-preview')[0];

    this.usernameInput = document.getElementById('input-username');
    this.locationInput = document.getElementById('input-location');
    this.bioInput = document.getElementById('input-bio');
    this.linkInput = document.getElementById('input-link');
    this.userIdentifier = document.getElementById('input-user-origin-identifier');

    this.messageBoxOfUsername = document.getElementById('message-username');

    this.reg = {
      validId : /^[a-z]+[a-z0-9]{3,11}$/,
    }

    this.messages = {
      id : {
        default : `<p style="color : red">username을 입력해주세요</p>`,
        duple : `<p style="color : red">중복된 username이 존재합니다</p>`,
        allowed :`<p style="color : green">사용해도 좋은 username입니다</p>`,
        notValid : `<p style="color : red">username은 4-12자의 숫자와 영문이어야 합니다</p>`
      },
    }

    this.isValidUsernameFlag = false;
  }

  isValidId(id) {
    return this.reg.validId.test(id);
  }

  addCheckDupleUsernameEvent() {
    this.usernameInput.addEventListener('keyup', (event) => {
      this.checkDupleUsername(event);
    })
  }

  async checkDupleUsername(event) {
    const inputValue = this.usernameInput.value;
    this.isValidUsernameFlag = false;

    if (inputValue === "") {
      const message = this.messages.id.default;
      this.messageBoxOfUsername.innerHTML = message;
      return;
    }

    const isExistUser = await this.ajax().checkUsernameForAjax(inputValue);

    if (!this.isValidId(inputValue)) {
      const message = this.messages.id.notValid;
      this.messageBoxOfUsername.innerHTML = message;
      return;
    }
    
    if (isExistUser) {
      const message = this.messages.id.duple;
      this.messageBoxOfUsername.innerHTML = message;
      return;
    }

    const message = this.messages.id.allowed;
    this.messageBoxOfUsername.innerHTML = message;
    this.isValidUsernameFlag = true;
    return;
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

  async updateUserInfoEvent(event) {
    const data = new FormData();
    const image = document.getElementById('post-image-btn').files[0];
    const username = this.usernameInput.value;
    const location = this.locationInput.value;
    const bio = this.bioInput.value;
    const link = this.linkInput.value;

    data.set('image', image);
    data.set('username', username);
    data.set('location', location);
    data.set('bio', bio);
    data.set('link', link);

    const result = await this.ajax().updateUserInfoAjax(data);
    return result;
  }

  addUpdateUserInfoEvent() {
    this.completeBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      if (!this.isValidUsernameFlag) {
        alert('회원 정보를 정확히 입력해주세요');
        return;
      }
    const result = await this.updateUserInfoEvent(event);

    if (result === 'success') {
      location.href = '/'
      return;
    }

    alert('다시 시도해주세요')
    return;
    })
  }

  ajax() {
    const checkUsernameForAjax = async (inputUsername) => {
      const url = `/check/username/${inputUsername}`;
      const response = await fetch(url, {
        method : 'GET',
      })
      return await response.text();
    }

    const updateUserInfoAjax = async (userInfoObj) => {
      const url = `/users/${this.userIdentifier.value}`;
      const response = await fetch(url, {
        method : 'PATCH',
        body : userInfoObj
      })
      return await response.text();
    }

    return {
      checkUsernameForAjax,
      updateUserInfoAjax,
    }
  }

  run() {
    this.addCheckDupleUsernameEvent();
    this.addUpdateUserInfoEvent();
    this.addChangeInputEvent();
  }
}

window.addEventListener('load', (event) => {
  const settingsHandler= new SettingsHandler();
  settingsHandler.run();
});