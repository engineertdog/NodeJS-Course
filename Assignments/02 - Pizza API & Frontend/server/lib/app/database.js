/**
 * Database
 *
 */

// Dependencies
const config = require("./config");
const mongoose = require("mongoose");

const server = config.databaseServer;
const db = config.database;

class Database {
    constructor () {
        this._connect();
    }

    _connect() {
        mongoose.connect(`mongodb://${server}/${db}`, {useNewUrlParser: true})
            .then(() => {
                console.log("Database connection successful.");
            })
            .catch(err => {
                console.error("Database connection error.");
            });
    }
}

module.exports = new Database();