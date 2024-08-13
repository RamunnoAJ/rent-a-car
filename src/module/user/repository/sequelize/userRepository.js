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
    getById(id) {
        const user = this.databaseAdapter
            .prepare(
                `
            SELECT
                id,
                created_at,
                updated_at,
                email,
                token,
                phone,
                name,
                nationality,
                address,
                driver_license,
                role
            FROM users WHERE id = ?
        `
            )
            .get(id);

        if (user === undefined) {
            throw new UserNotFoundError(`Couldn't find user with ID: ${id}`);
        }

        return fromDbToEntity(user);
    }

    /** @returns {Array<import("../../entity/User")>} */
    getAll() {
        const users = this.databaseAdapter
            .prepare(
                `
                SELECT
                    id,
                    created_at,
                    updated_at,
                    email,
                    token,
                    phone,
                    name,
                    nationality,
                    address,
                    driver_license,
                    role
                FROM users
            `
            )
            .all();

        return users.map(user => fromDbToEntity(user));
    }

    /**
     * @param {string} email
     * @returns {import("../../entity/User")}
     */
    getByEmail(email) {
        const user = this.databaseAdapter
            .prepare(
                `
            SELECT
                id,
                created_at,
                updated_at,
                email,
                token,
                phone,
                name,
                nationality,
                address,
                driver_license,
                role
            FROM users WHERE email = ?
        `
            )
            .get(email);

        if (user === undefined) {
            throw new UserNotFoundError(
                `Couldn't find user with email: ${email}`
            );
        }

        return fromDbToEntity(user);
    }

    /**
     * @param {import("../../entity/User")} user
     * @returns {boolean}
     */
    delete(user) {
        if (!user || !user.id) {
            throw new UserNotFoundError();
        }

        this.databaseAdapter
            .prepare("DELETE FROM users WHERE id = ?")
            .run(user.id);

        return true;
    }
};
