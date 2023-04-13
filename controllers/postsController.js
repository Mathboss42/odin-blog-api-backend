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

exports.postsNewPost = [
    passport.authenticate('jwt', {session: false}),
    
    (req, res, next) => {
        if (req.user.isAdmin) {
            return next();
        } else {
            res.status(403).send('NOT ADMIN, DENIED.');
        }
    },

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

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(400).json({
                title: req.body.title,
                text: req.body.text,
                status: req.body.status,
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

exports.postsDeletePost = [
    passport.authenticate('jwt', {session: false}),

    (req, res, next) => {
        if (req.user.isAdmin) {
            Post.findByIdAndRemove(req.params.id)
            .then(() => {
                res.status(200).send('Post successfully deleted');
            }).catch((err) => {
                next(err);
            });
        } else {
            res.status(403).send('You do not have permission to delete this post.');
        }
    }
];

exports.postsUpdatePost = [
    passport.authenticate('jwt', {session: false}),
    
    (req, res, next) => {
        if (req.user.isAdmin) {
            return next();
        } else {
            res.status(403).send('NOT ADMIN, DENIED.');
        }
    },

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
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(400).json({
                title: req.body.title,
                text: req.body.text,
                status: req.body.status,
                errors: errors.array()
            })
            return;
        }

        Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            text: req.body.text,
            author: req.user._id,
            status: req.body.status
        }).then(() => {
                res.status(200).json({
                    post: {
                        title: req.body.title,
                        text: req.body.text,
                        author: req.user.username,
                        status: req.body.status
                    }
                });
            }).catch((err) => {
                console.log(err);
                return next(err);
            })
    }
]