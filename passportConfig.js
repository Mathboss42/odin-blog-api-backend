const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require("passport-local").Strategy;

const User = require('./models/User');

passport.use(
    new LocalStrategy(async(username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            };
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    // passwords match! log user in
                    return done(null, user);
                } else {
                    // passwords do not match!
                    return done(null, false, { message: "Incorrect password" });
                }
            });
        } catch(err) {
            return done(err);
        };
    })
);