const AbstractUserRepository = require("../abstractUserRepository");
const { fromModelToEntity } = require("../../mapper/userMapper");
const User = require("../../entity/User");
const UserNotDefinedError = require("../error/userNotDefinedError");
const UserNotFoundError = require("../error/userNotFoundError");

module.exports = class UserRepository extends AbstractUserRepository {
    /** @param {typeof import("../../model/userModel")} userModel */
    constructor(userModel) {
        super();
        this.userModel = userModel;
    }

    /**
     * @param {import("../../entity/User")} user
     * @returns {import("../../entity/User")}
     */
    async save(user) {
        if (!(user instanceof User)) {
            throw new UserNotDefinedError();
        }

        const userInstance = this.userModel.build(user, {
            isNewRecord: !user.id
        });

        await userInstance.save();
        return fromModelToEntity(userInstance);
    }

    /**
     * @param {number} id
     * @returns {import("../../entity/User")}
     */
    getById(id) {}

    /** @returns {Array<import("../../entity/User")>} */
    getAll() {}

    /**
     * @param {string} email
     * @returns {import("../../entity/User")}
     */
    getByEmail(email) {}

    /**
     * @param {import("../../entity/User")} user
     * @returns {boolean}
     */
    delete(user) {}
};
