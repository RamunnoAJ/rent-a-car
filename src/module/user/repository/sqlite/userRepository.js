const AbstractUserRepository = require("../abstractUserRepository");
const UserNotFoundError = require("../error/userNotFoundError");
const { fromDbToEntity } = require("../../mapper/userMapper");

module.exports = class UserRepository extends AbstractUserRepository {
    /** @param {import("better-sqlite3").Database} databaseAdapater */
    constructor(databaseAdapater) {
        super();
        this.databaseAdapter = databaseAdapater;
    }

    /**
     * @param {import("../../entity/User")} user
     * @returns {import("../../entity/User")}
     */
    save(user) {
        let id;
        const isUpdate = user.id;

        if (isUpdate) {
            id = user.id;

            const statement = this.databaseAdapter.prepare(`
                UPDATE users SET
                    email = ?,
                    phone = ?,
                    name = ?,
                    nationality = ?,
                    address = ?,
                    driver_license = ?,
                    role = ?
                WHERE id = ?
            `);

            const params = [
                user.email,
                user.phone,
                user.name,
                user.nationality,
                user.address,
                user.driverLicense,
                user.role,
                user.id
            ];

            statement.run(params);
        } else {
            const statement = this.databaseAdapter.prepare(`
                INSERT INTO users(
                    email,
                    token,
                    phone,
                    name,
                    nationality,
                    address,
                    driver_license,
                    role
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const result = statement.run(
                user.email,
                user.token,
                user.phone,
                user.name,
                user.nationality,
                user.address,
                user.driverLicense,
                user.role
            );

            id = result.lastInsertRowid;
        }

        return this.getById(id);
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
};
