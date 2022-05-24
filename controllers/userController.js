const { User, Thought } = require('../models');
const { ObjectId } = require('mongoose').mongo
// getUsers,
//   getSingleUser,
//   createUser,
//   updateUser,
//   deleteUser,
//   addFriend,
//   removeFriend,
const headCount = async () => 
    User.aggregate()
        .count('userCount')
        .then((numberOfUsers) => numberOfUsers);

const thought = async (userId) =>
    User.aggregate([
        {
            $match: {_id:ObjectId(userId)}
        },
        {
            $unwind: '$thoughts',
        },
        {
            $group: { _id: userId, allThoughts: { $set: '$thoughts'}},
        },
    ])

module.exports = {
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                    headCount: await headCount(),
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
    },
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId})
            .select('-__v')
            .then(async (user) => 
                !user
                    ? res.status(404).json({ message: 'No user with that ID'})
                    : res.json({
                        user,
                        thought: await thought(req.params.userId),
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No such user exists' })
              : Thought.findOneAndUpdate(
                  { users: req.params.userId },
                  { $pull: { users: req.params.userId } },
                  { new: true }
                )
          )
          .then((friend) =>
            !friend
              ? res.status(404).json({
                  message: 'User deleted, but no friends found',
                })
              : res.json({ message: 'User successfully deleted' })
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
    },
}