/**
 * Helpers
 *
 */

// Dependencies
const crypto = require("crypto");

// Declare the module.
const helpers = {};

/**
 * Try to JSON stringify a passed string, or return an empty object if stringify fails.
 *
 * @param {string} string String to try to JSON stringify.
 */
helpers.stringifyJSON = string => {
    try {
        const json = JSON.stringify(string);
        return json;
    } catch (e) {
        return {};
    }
}

/**
 * Generates a random string of characters.
 *
 * @param {number} length Length of the random string.
 */
helpers.randomString = length => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString("hex") // Convert to hexadecimal
        .slice(0, length); // Return the required number of characters.
}

/**
 * Hash a string passed to the function with a randomly generated salt. Return both
 * the salt and the hashed value.
 *
 * @param {string} string String to be hashed.
 */
helpers.hash = string => {
    // Create a random string for the salt.
    const salt = helpers.randomString(20);
    // Hash the string with the salt.
    const hash = crypto.createHmac("sha512", salt).update(string).digest("hex");
    return Promise.resolve({
        salt: salt,
        hash: hash
    })
}

/**
 * Verify if a hashed value is equal to a string value hashed with a specific salt.
 *
 * @param {string} string String to be hashed and compare with.
 * @param {string} salt Salt to hash the passed string with.
 * @param {string} hash The hash to be compared against.
 */
helpers.verifyHash = (string, salt, hash) => {
    const newHash = crypto.createHmac("sha512", salt).update(string).digest("hex");

    if (newHash === hash) {
        return true;
    } else {
        return false;
    }
}

// Export the module.
module.exports = helpers;