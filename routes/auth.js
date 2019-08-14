const express = require('express'),
      router = express.Router(),
      authController = require('../controller/auth-controller');

// local-login
router.post('/local-login', (req, res, next) => {
  authController.localLogin(req, res, next)
})

router.get('/google-login', (req, res, next) => {
  authController.googleLogin(req, res, next);
})

router.get('/google-login/callback', (req, res, next) => {
  authController.googleLoginCallback(req, res, next);
})

router.get('/google-register', (req, res, next) => {
  authController.googleRegister(req, res, next);
})

router.get('/google-register/callback', (req, res, next) => {
  authController.googleRegisterCallback(req, res, next);
})

router.post('/logout', (req, res, next) => {
  authController.logout(req, res, next);
})

router.get('/resetpassword', (req, res, next) => {
  authController.resetPassword(req, res, next);
})

module.exports = router;