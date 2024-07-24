const User = require("../entity/User");
const UserNotDefinedError = require("./error/userNotDefinedError");
const UserIdNotDefinedError = require("./error/userIdNotDefinedError");

module.exports = class UserService {
    /** @param {import("../repository/abstractUserRepository")} userRepository  */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * @param {User} user
     */
    async save(user) {
        if (user === undefined) {
            throw new UserNotDefinedError();
        }

        return this.userRepository.save(user);
    }

    /**
     * @param {number} id
     */
    async getById(id) {
        if (id === undefined) {
            throw new UserIdNotDefinedError();
        }

        return this.userRepository.getById(id);
    }

    async getAll() {
        return this.userRepository.getAll();
    }
};
