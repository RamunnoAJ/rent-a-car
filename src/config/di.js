const { default: DIContainer, factory, object, get } = require("rsdi");
const Sqlite3Database = require("better-sqlite3");
const bcrypt = require("bcrypt");

const session = require("express-session");

const {
    UserController,
    UserRepository,
    UserService
} = require("../module/user/user");

function configureMainDatabaseAdapter() {
    return new Sqlite3Database(process.env.DB_PATH);
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
        Session: factory(configureSession),
        Bcrypt: factory(() => bcrypt)
    });
}

/**
 * @param {DIContainer} container
 */
function addUserModuleDefinitions(container) {
    container.addDefinitions({
        UserController: object(UserController).construct(get("UserService")),
        UserService: object(UserService).construct(
            get("UserRepository"),
            get("Bcrypt")
        ),
        UserRepository: object(UserRepository).construct(
            get("MainDatabaseAdapter")
        )
    });
}

/** @returns {DIContainer} */
function configureDI() {
    const container = new DIContainer();
    addCommonDefinitions(container);
    addUserModuleDefinitions(container);

    return container;
}

module.exports = configureDI;
