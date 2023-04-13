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

    (req, res, next) => {
        Comment.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(200).send('Comment successfully deleted');
        }).catch((err) => {
            next(err);
        });
    }
];