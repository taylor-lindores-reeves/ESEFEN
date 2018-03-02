const mongoose = require('mongoose')
const User = mongoose.model('User');

exports.board = async (req, res) => {
    const users = await User.find({isLoggedIn: true});
    res.render('board', {users});
}