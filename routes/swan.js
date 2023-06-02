var express = require('express');
var router = express.Router();

/* GET swan page. */
router.get('/', function(req, res, next) {
  res.render('swan');
});

module.exports = router;