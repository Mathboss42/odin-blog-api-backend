const passport = require("passport");
const { body, validationResult } = require("express-validator");

const Comment = require('../models/Comment');

exports.commentsGetAll = async (req, res, next) => {
    try {
        const comments = await Comment.find({});
        res.json({ comments });
    } catch (err) {
        return next(err);
    }
};

exports.commentsGetOne = async (req, res, next) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.id }).populate('author', { username: 1, _id: 0 });
        res.json({comment});
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

exports.commentsNewComment = [
    passport.authenticate('jwt', {session: false}),

    body('text', 'Text Contents must not be empty.')
        .trim()
        .isLength({ min: 2 })
        .escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(400).json({
                text: req.body.text,
                errors: errors.array()
            })
            return;
        }

        const comment = new Comment({
            text: req.body.text,
            author: req.user._id,
        });

        comment.save().then(() => {
            res.status(200).json({
                comment: {
                    text: comment.text,
                    author: req.user.username,
                }
            });
        }).catch((err) => {
            return next(err);
        });
    }
];

exports.commentsDeleteComment = [
    passport.authenticate('jwt', {session: false}),

    async (req, res, next) => {
        try { 
            const comment = await Comment.findById(req.params.id).populate('author');
            console.log(req.user.username, comment.author.username)
            if (req.user.isAdmin || req.user.username === comment.author.username) {
                Comment.findByIdAndRemove(req.params.id)
                .then(() => {
                    res.status(200).send('Comment successfully deleted');
                }).catch((err) => {
                    next(err);
                });
            } else {
                res.status(403).send('You do not have permission to delete this comment.');
            }
        } catch (err) {
            return next(err);
        }
    }
];

exports.postsUpdatePost = [
    passport.authenticate('jwt', {session: false}),

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