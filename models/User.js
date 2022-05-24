const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

const userSchema = new Schema (
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trimmed: true
        },
        email: {
            type: String,
            required: true,
            unique: true,

        },
        thoughts: [thoughtSchema],
        friends: [userSchema],
    }
);

const User = model('user', userSchema);

module.exports = User;