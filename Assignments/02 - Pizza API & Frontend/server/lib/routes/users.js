/**
 * Users
 *
 */

// Dependencies
const helpers = require("../util/helpers");
const userModel = require("../models/users");

// Declare the module.
const users = data => {
    const acceptableMethods = ["POST", "GET", "PUT", "DELETE"];

    if (acceptableMethods.indexOf(data.method) > -1) {
        return _users[data.method](data)
            .then(({status, payload}) => {
                return Promise.resolve({
                    status: status,
                    payload: payload
                })
            });
    }
}

const _users = {};

_users.POST = data => {
    const username = "tyler";
    const email = "test@mytest.com";
    const password = helpers.hash("test123");

    const newUser = new userModel({
        id: 1,
        username: username,
        email: email,
        salt: password[0],
        password: password[1]
    });

    return newUser.save()
        .then(doc => {
            return Promise.resolve({
                status: 200,
                payload: {
                    message: "We have added your account."
                }
            })
        })
        .catch(err => {
            let message;

            if (err.errmsg.indexOf("email_1") > -1) {
                message = "Email is already in use.";
            } else if (err.errmsg.indexOf("username_1") > -1) {
                message = "Username is already in use.";
            } else {
                message = "Error saving user.";
            }

            return Promise.resolve({
                status: 500,
                payload: {
                    error: message
                }
            });
        });
}

_users.GET = data => {
    return userModel
        .find()
        .then(doc => {
            return Promise.resolve({
                status: 200,
                payload: {
                    doc
                }
            })
        })
        .catch(err => {
            return Promise.resolve({
                status: 500,
                payload: {
                    error: "Error finding all users."
                }
            })
        });
}

_users.PUT = data => {
    return userModel
        .findOneAndUpdate({
            email: email
        }, {
                username: username,
                email: email
            }, {
                runValidators: true
            })
        .then(doc => {
            return Promise.resolve({
                status: 200,
                payload: {
                    doc
                }
            })
        })
        .catch(err => {
            return Promise.resolve({
                status: 500,
                payload: {
                    error: "Error updating user."
                }
            })
        });
}

_users.DELETE = data => {
    return userModel
        .findOneAndRemove({
            email: email
        })
        .then(res => {
            return Promise.resolve({
                status: 200,
                payload: {
                    res
                }
            })
        })
        .catch(err => {
            return Promise.resolve({
                status: 500,
                payload: {
                    error: "Error deleting user."
                }
            })
        })
}

// Export the module
module.exports = users;