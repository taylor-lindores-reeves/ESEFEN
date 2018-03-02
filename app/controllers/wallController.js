const mongoose = require('mongoose')
const User = mongoose.model('User');

exports.wall = async (req, res) => {
    const users = await User.find();
    res.render('wall', {users});
} 

exports.addattr = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById({_id: id})

    res.render('add_attribute', {user});
}