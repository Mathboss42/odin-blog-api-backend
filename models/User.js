const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, minLength: 2, maxLength: 100 },
    password: { type: String, required: true, minLength: 4},
    isAdmin: { type: Boolean, default: false },
    id: { type: Number, required: true }
});

module.exports = mongoose.model('User', UserSchema);