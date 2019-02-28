/**
 * Handlers
 *
 */

// Routes
const users = require("../routes/users");

// Declare the module.
const handlers = {};
handlers.users = data => {
    return users(data);
}

handlers.test = data => {
    return Promise.resolve({
        status: 200,
        payload: {
            success: "I am successful"
        }
    });
}

handlers.notFound = data => {
    // Return a 404 error that the page was not found.
    return Promise.resolve({
        status: 404,
        payload: {
            error: "The page you requested could not be found."
        }
    });
}

// Export the module.
module.exports = handlers;