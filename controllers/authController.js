const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");

const User = require('../models/User');

exports.authPost = [
    body("username", "Username must not be empty.")
        .trim()
        .isLength({ min: 2, max: 100 })
        .escape(),
    body("password", "Password must not be empty.")
        .trim()
        .isLength({ min: 4, max: 16 })
        .escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(400).send('Wrong id or pass.');
            return;
        }
        next();
    },

    passport.authenticate('local', {session: false}),

    (req, res, next) => {
        console.log('req.user', req.user);
        req.login(req.user, {session: false}, (err) => {
            if (err) {
                res.send(err);
                return;
            }

            const token = jwt.sign({user: req.user}, process.env.JWT_KEY, { expiresIn: '15s'});
            return res.json({user: req.user, token});
        });
    }
];

exports.newPost = [
    body("username", "Username must not be empty.")
        .trim()
        .isLength({ min: 2, max: 100 })
        .escape(),
    body("password", "Password must not be empty.")
        .trim()
        .isLength({ min: 4, max: 16 })
        .escape(),

    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(req.body.username, req.body.password)
            console.log(errors.array());
            res.status(400).send('Wrong inputs.');
            return;
        }

        try {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    return next(err);
                }

                const user = new User({
                    username: req.body.username,
                    password: hashedPassword,
                    isAdmin: false
                });
                const result = await user.save();
                
                res.send('Successfully created new user');
            });
        } catch(err) {
            return next(err);
        };
    }
];