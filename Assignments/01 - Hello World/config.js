/**
 * Create and export configuration variables.
 *
 */

// Create an Environments object.
const environments = {};

// Staging (default) environment
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging"
};

// Production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production"
};

// Determine the environment the server was started with.
const currentEnv = (typeof process.env.NODE_ENV === "string") ? process.env.NODE_ENV.toLowerCase() : "";

// Check that the current environment is one of the environments defined.
const exportEnv = environments[currentEnv] || environments.staging;

// Export the module.
module.exports = exportEnv;