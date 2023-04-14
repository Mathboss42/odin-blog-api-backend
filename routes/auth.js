var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

/* GET home page. */
router.post('/', authController.authPost);

router.post('/isLoggedIn', authController.authIsLoggedIn);

router.post('/new', authController.newPost);

module.exports = router;
