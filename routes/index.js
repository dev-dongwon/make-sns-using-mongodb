const express         = require('express'),
      router          = express.Router(),
      indexController = require('../controller/index-controller'),
      authMiddlewares = require('../middlewares/auth')

router.get('/', (req, res) => {
  indexController.home(req, res);
});

router.get('/signin', (req, res) => {
  indexController.signin(req, res);
})

router.get('/signup', (req, res) => {
  indexController.signup(req, res);
})

router.get('/forgotpassword', (req, res) => {
  indexController.forgotpassword(req, res);
})

router.get('/discover', (req, res, next) => {
  indexController.discover(req, res, next);
})

router.get('/following', authMiddlewares.isLoggedIn, (req, res, next) => {
  indexController.following(req, res, next);
})

module.exports = router;
