/**
 * Routes
 *
 */

// Include the route handlers.
const handler = require("./handler");

// Create a Routes object.
const routes = {
    "hello": handler.hello,
    "notFound": handler.notFound
};

// Export module.
module.exports = routes;