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