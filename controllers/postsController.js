const passport = require("passport");
const { body, validationResult } = require("express-validator");

const Post = require('../models/Post');

exports.postsGetAll = async (req, res, next) => {
    try {
        const posts = await Post.find({});
        res.json({ posts: posts });
    } catch (err) {
        return next(err);
    }
};

exports.postsNewPost = [
    passport.authenticate('jwt', {session: false}),
    
    (req, res, next) => {
        if (req.user.isAdmin) {
            return next();
        } else {
            res.status(403).send('NOT ADMIN, DENIED.');
        }
    },

    (req, res, next) => {console.log('yellow'), next()},

    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 2 })
        .escape(),
    body('text', 'Text Contents must not be empty.')
        .trim()
        .isLength({ min: 2 })
        .escape(),
    body('status', 'Status must be specified and must be either `published` or `archived`.')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .custom((value, { req }) => value === 'published' || value === 'archived'),

    async (req, res, next) => {
        console.log('green')
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log('brown')
            res.status(400).json({
                title: req.body.title,
                text: req.body.text,
                errors: errors.array()
            })
            return;
        }

        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            author: req.user._id,
            status: req.body.status
        });

        console.log('post', post)

        post.save().then(() => {
            res.status(200).json({
                post: {
                    title: post.title,
                    text: post.text,
                    author: req.user.username,
                    status: post.status
                }
            });
        }).catch((err) => {
            return next(err);
        });
    }
];

exports.postsGetOne = async (req, res, next) => {
    try {
        const post = await Post.findOne({ _id: req.params.id }, { _id: 0 }).populate('author', { username: 1, _id: 0 });
        if (post.status === 'published') {
            res.json({ post });
        } else {
            res.status(403).send('Post has not been published yet.');
        }
    } catch (err) {
        console.log(err);
        return next(err);
    }
};


exports.postCreatePost = [
    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 2 })
        .escape(),
    body('text', 'Text Contents must not be empty.')
        .trim()
        .isLength({ min: 2 })
        .escape(),

    async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render('new', {
                title: req.body.title,
                text: req.body.text,
            });
            return;
        }
        
        console.log(req.user);

        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            timeStamp: Date.now(),
            author: req.user._id
        });

        post.save().then(() => {
            res.redirect(post.url);
        }).catch((err) => {
            return next(err);
        });
    }
];

// exports.postDeleteGet = async (req, res, next) => {
//     if (req.user && req.user.isAdmin) {
//         const post = await Post.findById(req.params.id);
//         res.render('delete', { post: post });
//     } else {
//         res.redirect('/');
//     }
// };

// exports.postDeletePost = (req, res, next) => {
//     Post.findByIdAndRemove(req.params.id).then(() => {
//         res.redirect('/');
//     }).catch((err) => {
//         next(err);
//     });
// };