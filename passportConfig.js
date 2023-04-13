const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_KEY
    }, async function(jwtPayload, done){
        console.log('called')
        try {
            const user = await User.findOne({id: jwtPayload.userId}, { username: 1, isAdmin: 1 });

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            console.log(err);
            done(err);
        }
    })
)