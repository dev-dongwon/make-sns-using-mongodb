const ResetPasswordHandler = class {
  constructor() {
    this.passwordInput = document.getElementById('input-password');
    this.tokenValue = document.getElementById('reset-token');
    this.emailValue = document.getElementById('reset-email');
    this.messageBoxOfPassword = document.getElementById('message-password');
    this.resetBtn = document.getElementById('btn-reset');

    this.reg = {
      validPassword : /^[a-z0-9_-]{6,12}$/
    }

    this.messages = {
      password: {
        allowed :`<p style="color : green">사용해도 좋은 비밀번호입니다</p>`,
        notValid : `<p style="color : red">비밀번호는 6-12자리의 숫자나 영문이어야 합니다</p>`
      }
    }

    this.isValidPasswordFlag = false;
  }

  isValidPassword(password) {
    return this.reg.validPassword.test(password);
  }

  isValidForm() {
    return this.isValidPasswordFlag;
  }

  addCheckValidPasswordEvent() {
    this.passwordInput.addEventListener('keyup', (event) => {
      this.checkValidPassword(event);
    })
  }

  async resetPasswordEvent(event) {
    if (!this.isValidForm()) {
      alert('회원정보를 정확히 입력해주세요');
      return;
    }

    const infoObj = {
      token : this.tokenValue.textContent,
      password : this.passwordInput.value,
    }

    const successFlag = await this.ajax().resetPasswordEventAjax(infoObj);

    if (successFlag === 'false') {
      alert('해당 사용자가 없습니다');
      return;
    }
    
    alert('비밀번호가 성공적으로 변경되었습니다');
    location.href = '/signin'
    return;
  }

  addresetPasswordEvent() {
    this.resetBtn.addEventListener('click', (event) => {
      this.resetPasswordEvent(event)
    })
  }

  checkValidPassword(event) {
    const inputValue = this.passwordInput.value;
    if (!this.isValidPassword(inputValue)) {
      const message = this.messages.password.notValid;
      this.messageBoxOfPassword.innerHTML = message;
      return;
    }

    const message = this.messages.password.allowed;
    this.messageBoxOfPassword.innerHTML = message;
    this.isValidPasswordFlag = true;
    return;
  }

  ajax() {
    const resetPasswordEventAjax = async (infoObj) => {
      const url = `/api/resetpassword`;
      const response = await fetch(url, {
        method : 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body : JSON.stringify(infoObj)
      })
      return await response.text();
    }

    return {
      resetPasswordEventAjax
    }
  }

  run() {
    this.addCheckValidPasswordEvent();
    this.addresetPasswordEvent();
  }
}

window.addEventListener('load', () => {
  const resetPasswordHandler = new ResetPasswordHandler();
  resetPasswordHandler.run();
})