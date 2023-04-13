var express = require('express');
var router = express.Router();

const postsController = require('../controllers/postsController');

// POST ROUTES

router.get('/posts', postsController.postsGetAll);

router.get('/posts/:id', postsController.postsGetOne);

router.post('/posts/new', postsController.postsNewPost);

router.delete('/posts/:id', postsController.postsDeletePost);

router.put('/posts/:id', postsController.postsUpdatePost);


module.exports = router;
