var express = require('express');
var router = express.Router();

const postsController = require('../controllers/postsController');
const commentsController = require('../controllers/commentsController');

// POST ROUTES

router.get('/posts', postsController.postsGetAll);

router.get('/posts/:id', postsController.postsGetOne);

router.post('/posts/new', postsController.postsNewPost);

router.delete('/posts/:id', postsController.postsDeletePost);

router.put('/posts/:id', postsController.postsUpdatePost);

// COMMENT ROUTES

router.get('/comments', commentsController.commentsGetAll);

router.get('/comments/:id', commentsController.commentsGetOne);

router.post('/comments/new', commentsController.commentsNewComment);

router.delete('/comments/:id', commentsController.commentsDeleteComment);


module.exports = router;
