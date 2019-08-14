const SignupHandler = class {
  constructor() {
    this.timer;
    this.usernameInput = document.getElementById('input-username');
    this.emailInput = document.getElementById('input-email');
    this.passwordInput = document.getElementById('input-password');
    this.signupBtn = document.getElementById('btn-signup');

    this.messageBoxOfUsername = document.getElementById('message-username');
    this.messageBoxOfEmail = document.getElementById('message-email');
    this.messageBoxOfPassword = document.getElementById('message-password');
    this.googleRegisterBtn = document.getElementById('btn-google-signup');

    this.reg = {
      validEmail : /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/,
      validId : /^[a-z]+[a-z0-9]{3,11}$/,
      validPassword : /^[a-z0-9_-]{6,12}$/
    }

    this.messages = {
      id : {
        default : `<p style="color : red">ID를 입력해주세요</p>`,
        duple : `<p style="color : red">중복된 ID가 존재합니다</p>`,
        allowed :`<p style="color : green">사용해도 좋은 ID입니다</p>`,
        notValid : `<p style="color : red">아이디는 4-12자의 숫자와 영문이어야 합니다</p>`
      },
      email: {
        default : `<p style="color : red">이메일을 입력해주세요</p>`,
        duple : `<p style="color : red">중복된 이메일이 존재합니다</p>`,
        allowed :`<p style="color : green">사용해도 좋은 이메일입니다</p>`,
        notValid : `<p style="color : red">올바른 이메일 형식이 아닙니다</p>`
      },
      password: {
        allowed :`<p style="color : green">사용해도 좋은 비밀번호입니다</p>`,
        notValid : `<p style="color : red">비밀번호는 6-12자리의 숫자나 영문이어야 합니다</p>`
      }
    }

    this.isValidUsernameFlag = false;
    this.isValidEmailFlag = false;
    this.isValidPasswordFlag = false;
  }

  isValidEmail(email) {
    return this.reg.validEmail.test(email);
  }

  isValidId(id) {
    return this.reg.validId.test(id);
  }

  isValidPassword(password) {
    return this.reg.validPassword.test(password);
  }

  isValidUser() {
    return this.isValidEmailFlag && this.isValidUsernameFlag && this.isValidPasswordFlag;
  }

  addCheckValidUserEvent() {
    this.signupBtn.addEventListener('click', (event) => {
      if (!this.isValidUser()) {
        event.preventDefault();
        alert('회원정보를 정확히 입력해주세요');
      }
    })
  }

  addCheckDupleUsernameEvent() {
    this.usernameInput.addEventListener('keyup', (event) => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.checkDupleUsername(event);
      }, 500);
    })
  }
  
  addCheckDupleEmailEvent() {
    this.emailInput.addEventListener('keyup', (event) => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.checkDupleEmail(event);
      }, 500);
    })
  }

  addCheckValidPasswordEvent() {
    this.passwordInput.addEventListener('keyup', (event) => {
      this.checkValidPassword(event);
    })
  }

  googleRegisterEvent(event) {
    event.preventDefault();
    location.href = '/auth/google-register';
  }

  addGoogleRegisterEvent() {
    this.googleRegisterBtn.addEventListener('click', (event) => {
      this.googleRegisterEvent(event);
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

  async checkDupleEmail(event) {
    const inputValue = this.emailInput.value;
    const isExistUser = await this.ajax().checkEmailForAjax(inputValue);
    
    if (inputValue === "") {
      const message = this.messages.email.default;
      this.messageBoxOfEmail.innerHTML = message;
      return;
    }

    if (!this.isValidEmail(inputValue)) {
      const message = this.messages.email.notValid;
      this.messageBoxOfEmail.innerHTML = message;
      return;
    }
    
    if (isExistUser) {
      const message = this.messages.email.duple;
      this.messageBoxOfEmail.innerHTML = message;
      return;
    }

    const message = this.messages.email.allowed;
    this.messageBoxOfEmail.innerHTML = message;
    this.isValidEmailFlag = true;
    return;
  }

  async checkDupleUsername(event) {
    const inputValue = this.usernameInput.value;
    const isExistUser = await this.ajax().checkUsernameForAjax(inputValue);
    
    if (inputValue === "") {
      const message = this.messages.id.default;
      this.messageBoxOfUsername.innerHTML = message;
      return;
    }

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

  ajax() {
    const checkUsernameForAjax = async (inputUsername) => {
      const url = `check/username/${inputUsername}`;
      const response = await fetch(url, {
        method : 'GET',
      })
      return await response.text();
    }

    const checkEmailForAjax = async (inputEmail) => {
      const url = `check/useremail/${inputEmail}`;
      const response = await fetch(url, {
        method : 'GET',
      })
      return await response.text();
    }

    return {
      checkUsernameForAjax,
      checkEmailForAjax
    }
  }

  run() {
    this.addCheckDupleUsernameEvent();
    this.addCheckDupleEmailEvent();
    this.addCheckValidPasswordEvent();
    this.addCheckValidUserEvent();
    this.addGoogleRegisterEvent();
  }
}

window.addEventListener('load', () => {
  const signupHandler = new SignupHandler();
  signupHandler.run();
})