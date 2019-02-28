/**
 * Assignment #2 - Pizza Business API
 *
 * The files contained within this folder (/server/) relate to the backend processes and endpoints that
 * control the flow of data for a frontend application built in React-Native (found in /frontend/).
 *
 */

// Dependencies
const server = require("./lib/app/server");
const db = require("./lib/app/database");

// Declare the app.
const app = {};

// Initialize the app.
app.init = () => {
    // Start the HTTP / HTTPS server.
    server.init();
}

// Start the app.
app.init();

// Export the app.
module.exports = app;