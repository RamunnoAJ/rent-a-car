const CarController = require("./controller/carController");
const CarRepository = require("./repository/sqlite/carRepository");
const CarService = require("./service/carService");

/**
 * @param {import("express")} app
 * @param {import("rsdi").DIContainer} container
 */
function init(app, container) {
    /** @type {CarController} controller */
    const controller = container.get("CarController");
    controller.configureRoutes(app);
}

module.exports = {
    init,
    CarController,
    CarRepository,
    CarService
};
