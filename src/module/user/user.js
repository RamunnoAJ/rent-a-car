const UserController = require("./controller/userController");
const UserModel = require("./model/userModel");
const UserRepository = require("./repository/sequelize/userRepository");
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
    UserModel,
    UserRepository,
    UserService
};
