/**
 * Routes
 *
 */

// Dependencies
const handlers = require("./handlers");

// Create the Routes Object.
const routes = {
    test: handlers.test,
    users: handlers.users,
    notFound: handlers.notFound
}

// Export the module.
module.exports = routes;