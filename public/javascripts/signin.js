const SigninHandler = class {
  constructor() {
    this.googleLoginBtn = document.getElementById('btn-signin-google');
  }

  googleLoginEvent(event) {
    event.preventDefault();
    location.href = '/auth/google-login'
  }

  addGoogleLoginEvent() {
    this.googleLoginBtn.addEventListener('click', (event) => {
      this.googleLoginEvent(event);
    })
  }

  run() {
    this.addGoogleLoginEvent();
  }
}

window.addEventListener('load', (event) => {
  const signinHandler = new SigninHandler();
  signinHandler.run();
})