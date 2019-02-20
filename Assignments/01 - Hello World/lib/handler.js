/**
 * Route Handlers
 *
 */

// Define the Handler object.
const handler = {};

// Create a hello route function.
handler.hello = (data) => {
    // Set a default message.
    let message = "Hello, anonymous user. If you enter your name in a query string with a key of 'name', I will greet you by name.";

    if (data.method === "POST") {
        // Check if the request contained a name query.
        if ((data.queryStringObject).length !== 0 && data.queryStringObject.name) {
            // Send a custom return message based on the name.
            message = `Hello, ${data.queryStringObject.name}! Welcome to my Hello World API!`;
        }
    } else {
        message = `You sent a [${data.method}] request. Please send a [POST] request at ${data.path} to receive a welcome message.`;
    }

    // Return the status and message.
    return Promise.resolve({
        statusCode: 200,
        payload: {
            message: message
        }
    });
};

// Create the default Not Found function.
handler.notFound = (data) => {
    // Return a 404 error and default message.
    return Promise.resolve({
        statusCode: 404,
        payload: {
            error: "Resource not found."
        }
    });
};

// Export the module.
module.exports = handler;