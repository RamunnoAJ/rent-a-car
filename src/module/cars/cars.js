const CarController = require("./controller/carController");
const CarModel = require("./model/carModel");
const CarRepository = require("./repository/sequelize/carRepository");
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
    CarModel,
    CarRepository,
    CarService
};
