const AbstractUserRepository = require("../abstractUserRepository");

module.exports = class UserRepository extends AbstractUserRepository {
    /** @param {import("better-sqlite3").Database} databaseAdapater */
    constructor(databaseAdapater) {
        super();
        this.databaseAdapter = databaseAdapater;
    }

    //@returns {import("../../entity/User")}
    /**
     * @param {import("../../entity/User")} user
     * @returns {number}
     */
    save(user) {
        let id;
        const isUpdate = user.id;

        if (isUpdate) {
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

        return id;
    }
};
