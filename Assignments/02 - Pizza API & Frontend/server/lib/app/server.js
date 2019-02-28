/**
 * Server
 *
 */

// Dependencies - Ours
const config = require("./config");
const routes = require("../util/routes");
const helpers = require("../util/helpers");

// Dependencies - NodeJS
const http = require("http");
const https = require("https");
const url = require("url");
const path = require("path");
const fs = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;

// Declare the module.
const server = {};

/**
 * All of the server logic for both HTTP and HTTPS Servers is within this
 * function.
 */
server.server = (req, res) => {
    // Parse the URL.
    const parsedURL = url.parse(req.url, true);

    // Get the path of the request.
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get the query string as an object.
    const queryStringObject = parsedURL.query;

    // Get the HTTP method.
    const method = req.method.toUpperCase();

    // Get the headers as an object.
    const headers = req.headers;

    // Get the payload, if there is any.
    const decoder = new StringDecoder("utf-8");
    let buffer = "";

    req.on("data", data => {
        buffer += decoder.write(data);
    });

    req.on("end", () => {
        buffer += decoder.end();

        // Choose the handler this request with handle the request with.
        const handler = routes[trimmedPath] || routes.notFound;

        // Construct the data object to send to the handler.
        const data = {
            trimmedPath: trimmedPath,
            queryStringObject: queryStringObject,
            method: method,
            headers: headers,
            payload: helpers.stringifyJSON(buffer)
        }

        // Route the request to the handler specified in the router.
        handler(data)
            .then(({status, payload}) => {
                // Use the status code called back by the handler, or default to 200.
                status = (typeof status === "number") ? status : 200;

                // Use the payload called back by the handler, or default to an empty object.
                payload = (typeof payload === "object") ? payload : {};

                // Convert the payload to a JSON string.
                const payloadJSON = helpers.stringifyJSON(payload);

                // Return the response.
                res.setHeader("Content-Type", "application/json");
                res.writeHead(status);
                res.end(payloadJSON);

                // Log the request.
                const message = `[${method}: ${status}] Request at ${path}`;

                if (status === 200) {
                    console.log("\x1b[32m%s\x1b[0m", message);
                } else {
                    console.log("\x1b[31m%s\x1b[0m", message);
                }
            });
    });
}

// Instantiate the HTTP server.
server.httpServer = http.createServer(server.server);

// Instantiate the HTTPS server.
server.httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, "/../../../../../https/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "/../../../../../https/cert.pem"))
}

server.httpsServer = https.createServer(server.httpsOptions, server.server);

// Initialize the server.
server.init = () => {
    // Start the HTTP Server.
    server.httpServer.listen(config.httpPort, () => {
        console.log("\x1b[36m%s\x1b[0m", `Running a ${config.envName} environment at http://${config.hostname}:${config.httpPort}`);
    });

    // Start the HTTPS Server.
    server.httpsServer.listen(config.httpsPort, () => {
        console.log("\x1b[35m%s\x1b[0m", `Running a ${config.envName} environment at http://${config.hostname}:${config.httpsPort}`);
    });
}

// Export the module.
module.exports = server;