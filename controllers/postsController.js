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
            res.send('NEW POST');
        } else {
            res.status(403).send('NOT ADMIN, DENIED.');
        }
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

// exports.postCreateGet = (req, res) => {
//     if (req.user) {
//         res.render('new', { title: undefined, text: undefined});
//     } else {
//         res.redirect('/');
//     }
// };

// exports.postCreatePost = [
//     body('title', 'Title must not be empty.')
//         .trim()
//         .isLength({ min: 2 })
//         .escape(),
//     body('text', 'Text Contents must not be empty.')
//         .trim()
//         .isLength({ min: 2 })
//         .escape(),

//     async (req, res, next) => {
//         const errors = validationResult(req);

//         if(!errors.isEmpty()) {
//             res.render('new', {
//                 title: req.body.title,
//                 text: req.body.text,
//             });
//             return;
//         }
        
//         console.log(req.user);

//         const post = new Post({
//             title: req.body.title,
//             text: req.body.text,
//             timeStamp: Date.now(),
//             author: req.user._id
//         });

//         post.save().then(() => {
//             res.redirect(post.url);
//         }).catch((err) => {
//             return next(err);
//         });
//     }
// ];

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