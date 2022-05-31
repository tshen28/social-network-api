const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                return res.json(users);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(
                        user
                    )
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, {$set: req.body}, {runValidators: true, new: true})
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(
                        user
                    )
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No such user exists' })
                    : res.json({ message: 'User successfully deleted'})
            )
            // .then((friend) =>
            //     !friend
            //         ? res.status(404).json({
            //             message: 'User deleted, but no friends found',
            //         })
            //         : res.json({ message: 'User successfully deleted' })
            // )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    addFriend (req, res) {
        console.log('You are adding a friend');
        console.log(req.body);
        User.findOneAndUpdate({ _id: req.params.userId}, { $addToSet: { friends: req.params.friendId}}, {runValidators: true, new: true})
        .then((user) => 
            !user
                ? res.status(404).json({ message: 'No user found with that ID'})
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    removeFriend (req, res) {
        User.findOneAndUpdate({ _id: req.params.userId}, {$pull: { friends: {friendId: req.params.friendId}}}, {runValidators: true, new: true})
        .then ((user) => 
            !user
                ? res.status(404).json({message: 'No user found with that ID'})
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    }
}