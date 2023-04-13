var express = require('express');
var router = express.Router();

const postsConroller = require('../controllers/postsController');

// POST ROUTES

router.get('/posts', postsConroller.postsGetAll);

router.get('/posts/:id', postsConroller.postsGetOne);

router.post('/posts/new', postsConroller.postsNewPost);


module.exports = router;
