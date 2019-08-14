const MessageHandler = class {
  constructor() {
    this.messageInput = document.getElementById('main-message-input');
    this.messageInfo = document.getElementById('main-message-info-box');
    this.messageWrapper = document.getElementById('main-message-wrapper');
    this.exitBtn = document.getElementById('main-message-exit-box');
  }

  addExitMessageEvent() {
    this.exitBtn.addEventListener('click', (event) => {
      event.target.parentNode.style.display = 'none';
    })
  }

  getMessageType(messageObj) {
    this.messageWrapper.style.display = 'grid';
    if (messageObj.hasOwnProperty('info')) {
      this.messageInfo.innerText = `INFO : ${messageObj.info}`;
      return;
    }

    if (messageObj.hasOwnProperty('success')) {
      this.messageWrapper.style.background = 'rgb(200, 255, 213)';
      this.messageWrapper.style.color = 'green';
      this.messageInfo.innerText = `SUCCESS : ${messageObj.success}`;
      return;
    }

    if (messageObj.hasOwnProperty('warning')) {
      this.messageWrapper.style.background = 'rgb(255, 253, 136)';
      this.messageWrapper.style.color = 'rgb(148, 148, 46)';
      this.messageInfo.innerText = `WARNING : ${messageObj.warning}`;
      return;
    }

    if (messageObj.hasOwnProperty('error')) {
      this.messageWrapper.style.background = 'rgb(252, 195, 195)';
      this.messageWrapper.style.color = 'rgb(233, 68, 68);';
      this.messageInfo.innerText = `ERROR : ${messageObj.error}`;
      return;
    }
  }

  getMessageData() {
    const message = this.messageInput.value;
    return JSON.parse(message)[0];
  }

  run() {
    const messageObj = this.getMessageData();
    if (messageObj) {
      this.getMessageType(messageObj);
    }
    this.addExitMessageEvent();
  }
}

window.addEventListener('load', (event) => {
  const messageHandler = new MessageHandler();
  messageHandler.run();
})