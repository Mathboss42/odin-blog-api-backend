var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/auth');
});

router.get('/posts', function(req, res, next) {
    res.redirect('/posts');
})

module.exports = router;
