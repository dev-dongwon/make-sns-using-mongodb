const express     = require('express'),
      userController  = require('../controller/user-controller'),
      router          = express.Router(),
      auth            = require('../middlewares/auth'),
      upload          = require('../utils/multer-upload');

      require('../auth/passport').setup()

router.post('/', (req, res, next) => {
  userController.addUser(req, res, next);
})

router.patch('/:usernameOrOauthId', upload.array('image', 4), (req, res, next) => {
  userController.updateUser(req, res, next);
})

router.get('/settings', auth.isLoggedIn, (req, res) => {
  userController.getSettingsPage(req, res)
})

router.get('/initSettings', auth.isLoggedIn, (req, res) => {
  userController.getInitSettingsPage(req, res)
})

router.get('/:username/likes', (req, res, next) => {
  userController.getLikesPage(req, res, next);
})

router.delete('/:username', auth.isLoggedIn, (req, res, next) => {
  userController.deleteUser(req, res, next);
})

module.exports = router;