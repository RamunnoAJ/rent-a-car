const UserController = require("./controller/userController");
const UserRepository = require("./repository/sqlite/userRepository");
const UserService = require("./service/userService");

/**
 * @param {import("express")} app
 * @param {import("rsdi").DIContainer} container
 */
function init(app, container) {
    /** @type {UserController} controller */
    const controller = container.get("UserController");
    controller.configureRoutes(app);
}

module.exports = {
    init,
    UserController,
    UserRepository,
    UserService
};
