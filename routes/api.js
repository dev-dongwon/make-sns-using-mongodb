const express = require('express'),
      router = express.Router(),
      apiController = require('../controller/api-controller')
      authMiddlewares = require('../middlewares/auth'),

router.post('/forgotpassword', (req, res, next) => {
  apiController.sendPasswordCheckEmail(req, res, next);
})

router.patch('/resetpassword', (req, res, next) => {
  apiController.resetPassword(req, res, next);
})

router.patch('/follow/:userId', authMiddlewares.isLoggedInforAjax, (req, res, next) => {
  apiController.updateFollowStatus(req, res, next);
})


module.exports = router;