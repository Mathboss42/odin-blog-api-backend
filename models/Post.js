const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, minLength: 2 },
    text: { type: String, required: true, minLength: 10 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true, enum: ['published', 'archived'] }
});

PostSchema.virtual('url').get(function () {
    return `/posts/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);