const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Post must have a title"]
    },
    content: {
        type: String,
        required: [true, "Post must have some content"]
    }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
