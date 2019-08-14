const express         = require('express'),
      router          = express.Router(),
      checkController = require('../controller/check-controller');

router.get('/username/:username', (req, res, next) => {
  checkController.checkDupleUsername(req, res, next);
});

router.get('/useremail/:email', (req, res) => {
  checkController.checkDupleEmail(req, res);
});

module.exports = router;
