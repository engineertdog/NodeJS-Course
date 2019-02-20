/**
 * Assignment #1 - Hello World API
 *
 * This is a basic Hello World API that utilizes the basic HTTP and HTTPS protocols for
 * creating a server in NodeJS (without using 3rd party libraries) and handling responses
 * to requests sent to the server.
 *
 */

// Dependencies
const config = require("./config");
const routes = require("./lib/routes");
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require("fs");

/**
 * Servers both HTTP and HTTPS requests and handles their responses.
 *
 * @param {object} req Request object
 * @param {object} res Response object
 */
const server = async (req, res) => {
    // Parse the URL.
    const parsedURL = url.parse(req.url, true);

    // Get the path of the request.
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get the query string as an object.
    const queryStringObject = parsedURL.query;

    // Get the HTTP Method.
    const method = req.method.toUpperCase();

    // Get the headers as an object.
    const headers = req.headers;

    // Get the payload, if there is any.
    const decoder = new StringDecoder("utf-8");
    let buffer = "";

    // Grab the stream data and add it to the payload (buffer).
    req.on("data", data => {
        buffer += decoder.write(data);
    });

    /**
     * Perform the request handling and response after the data stream to the server has ended.
     *
     */
    req.on("end", () => {
        // End the payload.
        buffer += decoder.end();

        // Construct the data object to send to the handler.
        const data = {
            path: path,
            trimmedPath: trimmedPath,
            queryStringObject: queryStringObject,
            method: method,
            headers: headers,
            payload: buffer
        }

        // Choose the handler to respond to the request with.
        const handler = routes[trimmedPath] || routes.notFound;

        /**
         * Handle the request by utilizing the function defined for the path, if there is any.
         * Default to the Not Found route if there is no function found for the URL path
         * the user is trying to invoke.
         *
         */
        handler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200.
            statusCode = (typeof statusCode === "number") ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object.
            payload = (typeof payload === "object") ? payload : {};

            // Convert the payload to a JSON string.
            const payloadJSON = JSON.stringify(payload);

            // Return the response.
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadJSON);

            // Log the request
            console.log(`[${method}: ${statusCode}] Request at ${trimmedPath}`);
        });
    });
};

// Instantiate the HTTP Server
http.createServer(server)
    .listen(config.httpPort, () => {
        console.log(`Running a ${config.envName} environment on port ${config.httpPort}`);
    });

// Instantiate the HTTPS Server. Need the SSL information to do this.
const httpsServerOptions = {
    key: fs.readFileSync("../../https/key.pem"),
    cert: fs.readFileSync("../../https/cert.pem")
}

https.createServer(httpsServerOptions, server)
    .listen(config.httpsPort, () => {
        console.log(`Running a ${config.envName} environment on port ${config.httpsPort}`);
    });