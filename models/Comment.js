const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: { type: String, required: true, minLength: 10 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

CommentSchema.virtual('url').get(function () {
    return `/comments/${this._id}`;
});

module.exports = mongoose.model('Comment', CommentSchema);