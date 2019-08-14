const express         = require('express'),
      router          = express.Router(),
      contentController = require('../controller/content-controller'),
      upload          = require('../utils/multer-upload'),
      authMiddlewares = require('../middlewares/auth'),
      contentsMiddlewares = require('../middlewares/content')

router.get('/:contentNumber', (req, res, next) => {
  contentController.getContentPage(req, res, next);
});

router.delete('/:contentNumber', authMiddlewares.isLoggedIn, contentsMiddlewares.isAuthor, (req, res, next) => {
  contentController.deleteContent(req, res, next);
})

router.patch('/:contentNumber', authMiddlewares.isLoggedIn, contentsMiddlewares.isAuthor, upload.array('image', 4), (req, res, next) => {
  contentController.updateContent(req, res, next);
})

router.patch('/meta/:contentNumber/like', authMiddlewares.isLoggedInforAjax, (req, res, next) => {
  contentController.updateLike(req, res, next);
})

module.exports = router;