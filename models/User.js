const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, minLength: 2, maxLength: 100 },
    password: { type: String, required: true, minLength: 8},
    isAdmin: { type: Boolean, default: false }
});

UserSchema.virtual('url').get(function () {
    return `/users/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);