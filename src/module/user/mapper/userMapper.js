const User = require("../entity/User");

/**
 * @param {Object} formData
 * @returns {User}
 */
function fromModelToEntity({
    id,
    email,
    token,
    phone,
    name,
    nationality,
    address,
    driver_license,
    role,
    createdAt = null,
    updatedAt = null,
    deletedAt = null
}) {
    return new User(
        id,
        email,
        token,
        phone,
        name,
        nationality,
        address,
        driver_license,
        role,
        createdAt,
        updatedAt,
        deletedAt
    );
}

/**
 * @param {Object} formData
 * @returns {User}
 */
function fromDataToEntity({
    id,
    email,
    password,
    phone,
    name,
    country,
    address,
    "driver-license": driverLicense
}) {
    return new User(
        id,
        email,
        password,
        phone,
        name,
        country,
        address,
        driverLicense,
        "User"
    );
}

module.exports = {
    fromModelToEntity,
    fromDataToEntity
};
