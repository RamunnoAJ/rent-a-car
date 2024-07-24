const User = require("../entity/User");
const UserNotDefinedError = require("./error/userNotDefinedError");
const UserIdNotDefinedError = require("./error/userIdNotDefinedError");
const UserEmailNotDefinedError = require("./error/userEmailNotDefinedError");
const UserPasswordNotDefinedError = require("./error/userPasswordNotDefinedError");

module.exports = class UserService {
    /**
     * @param {import("../repository/abstractUserRepository")} userRepository
     * @param {import("bcrypt")} bcrypt
     */
    constructor(userRepository, bcrypt) {
        this.userRepository = userRepository;
        this.bcrypt = bcrypt;
    }

    /**
     * @param {User} user
     */
    async save(user) {
        if (user === undefined) {
            throw new UserNotDefinedError();
        }

        const salt = await this.bcrypt.genSalt(10);
        user.token = await this.bcrypt.hash(user.token, salt);

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

    /**
     * @param {string} email
     * @returns {User}
     */
    async getByEmail(email) {
        if (email === undefined) {
            throw new UserEmailNotDefinedError();
        }

        return this.userRepository.getByEmail(email);
    }

    /**
     * @param {string} password
     * @param {string} storedPassword
     * @returns {Promise<boolean>}
     */
    async comparePasswords(password, storedPassword) {
        if (password === undefined) {
            return new UserPasswordNotDefinedError();
        }

        return await this.bcrypt.compare(password, storedPassword);
    }
};
