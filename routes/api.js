var express = require('express');
var router = express.Router();

router.get('/posts', function(req, res, next) {
    res.redirect('/posts');
})

module.exports = router;
