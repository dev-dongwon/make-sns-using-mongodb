const express         = require('express'),
      router          = express.Router(),
      postController  = require('../controller/post-controller'),
      upload          = require('../utils/multer-upload'),
      authMiddlewares = require('../middlewares/auth')

router.post('/', authMiddlewares.isLoggedIn, upload.array('image', 4), (req, res, next) => {
  postController.uploadImage(req, res, next);
})

module.exports = router;