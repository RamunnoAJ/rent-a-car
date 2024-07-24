const User = require("../entity/User");

/**
 * @param {number} id
 * @param {string} createdAt
 * @param {string} updatedAt
 * @param {string} email
 * @param {string} token
 * @param {string} phone
 * @param {string} name
 * @param {string} nationality
 * @param {string} address
 * @param {string} driverLicense
 * @param {string} role
 * @returns {User}
 */
function fromDbToEntity(
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
) {
    return new User(
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
    );
}

module.exports = {
    fromDbToEntity
};
