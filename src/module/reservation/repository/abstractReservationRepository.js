const AbstractReservationRepositoryError = require("./error/abstractReservationRepositoryError");
const MethodNotImplementedError = require("./error/methodNotImplementedError");

module.exports = class AbstractReservationRepository {
    constructor() {
        if (new.target === AbstractReservationRepository) {
            throw new AbstractReservationRepositoryError();
        }
    }

    /**
     * @param {import("../entity/Reservation")} reservation
     * @returns {import("../entity/Reservation")} */
    async save(reservation) {
        throw new MethodNotImplementedError();
    }

    /**
     * @param {number} id
     * @returns {import("../entity/Reservation")} */
    async getById(id) {
        throw new MethodNotImplementedError();
    }

    /** @returns {Array<import("../entity/Reservation")>} */
    async getAll() {
        throw new MethodNotImplementedError();
    }

    /**
     * @param {import("../entity/Reservation")} reservation
     * @returns {boolean} */
    async delete(reservation) {
        throw new MethodNotImplementedError();
    }
};
