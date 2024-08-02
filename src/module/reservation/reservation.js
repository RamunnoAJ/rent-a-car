const ReservationController = require("./controller/reservationController");
const ReservationRepository = require("./repository/sqlite/reservationRepository");
const ReservationService = require("./service/reservationService");

/**
 * @param {import("express")} app
 * @param {import("rsdi").DIContainer} container
 */
function init(app, container) {
    /** @type {ReservationController} controller */
    const controller = container.get("ReservationController");
    controller.configureRoutes(app);
}

module.exports = {
    init,
    ReservationController,
    ReservationRepository,
    ReservationService
};
