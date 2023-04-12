var express = require('express');
var router = express.Router();

const postsConroller = require('../controllers/postsController');

/* GET home page. */
router.get('/', postsConroller.postsGetAll);

router.post('/new', postsConroller.postsNewPost);

module.exports = router;
