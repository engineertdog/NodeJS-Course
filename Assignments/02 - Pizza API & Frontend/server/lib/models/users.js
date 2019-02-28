/**
 * Users model
 *
 */

// Dependencies
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    id: Number,
    username: {
        type: String,
        index: true,
        required: true,
        unique: true,
        validate: value => {
            return value.length > 4
        }
    },
    email: {
        type: String,
        index: true,
        required: true,
        unique: true,
        validate: value => {
            return validator.isEmail(value)
        }
    },
    salt: String,
    password: String,
    createdAt: Date,
    updatedAt: Date
});

userSchema.index({username: 1, email: 1}, {unique: true});

userSchema.pre("save", function (next) {
    const now = Date.now();

    this.updatedAt = now;

    if (!this.createdAt) {
        this.createdAt = now;
    }

    next();
})

module.exports = mongoose.model("User", userSchema);