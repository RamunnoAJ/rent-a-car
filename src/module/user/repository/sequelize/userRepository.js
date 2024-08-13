const AbstractUserRepository = require("../abstractUserRepository");
const { fromModelToEntity } = require("../../mapper/userMapper");
const User = require("../../entity/User");
const UserEmailNotDefinedError = require("../error/userEmailNotDefinedError");
const UserIdNotDefinedError = require("../error/userIdNotDefinedError");
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
    async getById(id) {
        if (!Number(id)) {
            throw new UserIdNotDefinedError();
        }

        const userInstance = await this.userModel.findByPk(id);
        if (!userInstance) {
            throw new UserNotFoundError();
        }

        return fromModelToEntity(userInstance);
    }

    /** @returns {Array<import("../../entity/User")>} */
    async getAll() {
        const usersInstance = await this.userModel.findAll({
            where: { deletedAt: null }
        });
        return usersInstance.map(fromModelToEntity);
    }

    /**
     * @param {string} email
     * @returns {import("../../entity/User")}
     */
    async getByEmail(email) {
        if (!email) {
            throw new UserEmailNotDefinedError();
        }

        const userInstance = await this.userModel.findOne({ where: { email } });
        if (!userInstance) {
            throw new UserNotFoundError();
        }

        return fromModelToEntity(userInstance);
    }

    /**
     * @param {import("../../entity/User")} user
     * @returns {boolean}
     */
    async delete(user) {
        if (!(user instanceof User)) {
            throw new UserNotDefinedError();
        }

        return Boolean(
            await this.userModel.destroy({ where: { id: user.id } })
        );
    }
};
