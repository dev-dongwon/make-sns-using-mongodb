const PostHandler = class {
  constructor() {
    this.dropArea = document.getElementById('content');
    this.previewArea = document.getElementById('post-preview-area');
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

        this.previewArea.appendChild(img);
      }
    }
  }

  run() {
    this.addChangeInputEvent();
  }
}

window.addEventListener('load', () => {
  const postHandler = new PostHandler();
  postHandler.run();
})