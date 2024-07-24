const { default: DIContainer, factory } = require("rsdi");
const Sqlite3Database = require("better-sqlite3");

const session = require("express-session");

function configureMainDatabaseAdapter() {
    return new Sqlite3Database(process.env.DB_PATH, { verbose: console.log });
}

function configureSession() {
    const ONE_WEEK_IN_SECONDS = 604800000;

    const sessionOptions = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: ONE_WEEK_IN_SECONDS }
    };

    return session(sessionOptions);
}

/**
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
    container.addDefinitions({
        MainDatabaseAdapter: factory(configureMainDatabaseAdapter),
        Session: factory(configureSession)
    });
}

/** @returns {DIContainer} */
function configureDI() {
    const container = new DIContainer();
    addCommonDefinitions(container);

    return container;
}

module.exports = configureDI;
