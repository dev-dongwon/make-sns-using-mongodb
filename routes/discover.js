const express         = require('express'),
      router          = express.Router(),
      discoverController = require('../controller/discover-controller');

router.get('/trending', (req, res) => {
  discoverController.trending(req, res);
});

module.exports = router;