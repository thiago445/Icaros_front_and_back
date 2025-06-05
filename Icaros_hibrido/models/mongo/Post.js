const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String },
    imageUrl: { type: String },
    userId: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
        {
            userId: { type: String },
            comment: { type: String },
        },
    ],
    createdAt: { type: Date, default: Date.now } // Adicionando data automática
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
