/**
 * App Config
 *
 */

// Declare the module.
const config = {};

// Common settings between environments.
config.com = {

}

/**
 * Staging environment.
 *
 */
config.staging = {
    envName: "staging",
    hostname: "localhost",
    httpPort: 3000,
    httpsPort: 3001,
    databaseServer: "localhost:27017",
    database: "pizza",
    com: config.com
}

/**
 * Production environment.
 *
 */
config.production = {
    envName: "production",
    hostname: "localhost",
    httpPort: 5000,
    httpsPort: 5001,
    databaseServer: "localhost:27017",
    database: "pizza",
    com: config.com
}

// Determine which environment is wanted based on the NODE_ENV.
const currEnv = (typeof process.env.NODE_ENV === "string") ? process.env.NODE_ENV.toLowerCase() : "";

// Check that the current environment is one of the environments above. If not, default to staging.
const envToExport = config[currEnv] || config.staging;

// Export the module.
module.exports = envToExport;