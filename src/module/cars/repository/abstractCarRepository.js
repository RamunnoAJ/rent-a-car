const AbstractCarRepositoryError = require("./error/abstractCarRepositoryError");
const MethodNotImplementedError = require("./error/methodNotImplementedError");

module.exports = class AbstractCarRepository {
    constructor() {
        if (new.target === AbstractCarRepository) {
            throw new AbstractCarRepositoryError();
        }
    }

    /**
     * @param {import("../entity/Car")} car
     * @returns {import("../entity/Car")} */
    async save(car) {
        throw new MethodNotImplementedError();
    }

    /**
     * @param {number} id
     * @returns {import("../entity/Car")} */
    async getById(id) {
        throw new MethodNotImplementedError();
    }

    /** @returns {Array<import("../entity/Car")>} */
    async getAll() {
        throw new MethodNotImplementedError();
    }

    /**
     * @param {import("../entity/Car")} car
     * @returns {boolean} */
    async delete(car) {
        throw new MethodNotImplementedError();
    }
};
