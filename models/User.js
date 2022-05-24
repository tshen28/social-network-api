const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

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
        thoughts: [Thought],
        friends: [User],
    },
    {
        toJSON: {
            getters: true,
            virtuals: true,
        },
    }
);

userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    });

const User = model('user', userSchema);

module.exports = User;