var express = require('express');
var router = express.Router();

const postsConroller = require('../controllers/postsController');

/* GET home page. */
router.get('/', postsConroller.postsGetAll);

module.exports = router;
