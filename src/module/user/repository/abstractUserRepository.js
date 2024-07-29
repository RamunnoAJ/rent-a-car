const AbstractUserRepositoryError = require("./error/abstractUserRepositoryError");
const MethodNotImplementedError = require("./error/methodNotImplementedError");

module.exports = class AbstractUserRepository {
    constructor() {
        if (new.target === AbstractUserRepository) {
            throw new AbstractUserRepositoryError();
        }
    }

    /**
     * @param {import("../entity/User")} user
     * @returns {import("../entity/User")} */
    async save(user) {
        throw new MethodNotImplementedError();
    }

    /**
     * @param {number} id
     * @returns {import("../entity/User")} */
    async getById(id) {
        throw new MethodNotImplementedError();
    }

    /** @returns {Array<import("../entity/User")>} */
    async getAll() {
        throw new MethodNotImplementedError();
    }

    /**
     * @param {import("../entity/User")} user
     * @returns {boolean} */
    async delete(user) {
        throw new MethodNotImplementedError();
    }
};
