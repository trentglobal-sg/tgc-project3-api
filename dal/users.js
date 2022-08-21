const {User, Role} = require('../models')

const registerUser = async (userData) => {
    


    const user = new User(userData);
    await user.save();

    return user;
}

const getAllRoles = async() => {
    const roles = await Role.fetchAll().map(role => {
        return [role.get('id'), role.get('role')]
    })
    return roles
}

const getAllUsers = async() => {
    const users = await User.fetchAll({
        withRelated:['role']
    })
    return users.toJSON();
}

module.exports = {
    registerUser,
    getAllRoles,
    getAllUsers
}