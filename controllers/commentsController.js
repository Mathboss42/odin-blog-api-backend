const passport = require("passport");
const { body, validationResult } = require("express-validator");

const Comment = require('../models/Comment');

exports.commentsGetAll = async (req, res, next) => {
    try {
        const comments = await Comment.find({}).populate('author', { username: 1, _id: 0 });
        res.json({ comments });
    } catch (err) {
        return next(err);
    }
};

exports.commentsGetAllFromPost = async (req, res, next) => {
    try {
        // console.log('called');  
        const comments = await Comment.find({ post: req.params.postid }).populate('author', { username: 1, _id: 0 });
        console.log(req.params)
        res.json({ comments });
    } catch (err) {
        return next(err);
    }
};

exports.commentsGetAllFromPostWithAuth = [
    passport.authenticate('jwt', {session: false}),

    async (req, res, next) => {
        try {
            // console.log('called');  
            let comments = await Comment.find({ post: req.params.postid }).populate('author', { username: 1, _id: 0 });
            comments = JSON.parse(JSON.stringify(comments));
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].author.username === req.user.username) {
                    comments[i].isEditable = true;
                } else {
                    comments[i].isEditable = false;
                }
                // console.log(comments[i]);
            }
            // console.log(comments);
            // console.log(req.params)
            res.json({ comments });
        } catch (err) {
            return next(err);
        }
    }
]

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
    (req, res, next) => {console.log('asdasdasdasdasdasdasd'); next()},

    body('text', 'Text Contents must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('post', 'Post must not be empty.')
        .trim()
        .isLength({ min: 1 })
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
            post: req.body.post,
        });

        comment.save().then(() => {
            res.status(200).json({
                comment: {
                    text: comment.text,
                    author: req.user.username,
                    post: comment.post,
                }
            });
        }).catch((err) => {
            console.log('err', err)
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

exports.commentsUpdateComment = [
    passport.authenticate('jwt', {session: false}),

    body('text', 'Text Contents must not be empty.')
        .trim()
        .isLength({ min: 2 })
        .escape(),
    body('post', 'Post must not be empty.')
        .trim()
        .isLength({ min: 2 })
        .escape(),

    async (req, res, next) => {
        try {
            const comment = await Comment.findById(req.params.id).populate('author');
            if (req.user.isAdmin || req.user.username === comment.author.username) {
                const errors = validationResult(req);

                if(!errors.isEmpty()) {
                    res.status(400).json({
                        text: req.body.text,
                        errors: errors.array()
                    })
                    return;
                }
        
                Comment.findByIdAndUpdate(req.params.id, {
                    text: req.body.text,
                }).then(() => {
                        res.status(200).json({
                            post: {
                                text: req.body.text,
                                author: comment.author.username,
                                post: comment.post,
                            }
                        });
                    }).catch((err) => {
                        console.log(err);
                        return next(err);
                    })
            } else {
                res.status(403).send('You do not have permission to edit this comment.');
            }
        } catch (err) {
            return next(err);
        }
    }
]