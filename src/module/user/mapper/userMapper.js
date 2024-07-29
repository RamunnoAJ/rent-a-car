const User = require("../entity/User");

/**
 * @param {Object} formData
 * @returns {User}
 */
function fromDbToEntity({
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
}) {
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
        null,
        null,
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
    fromDbToEntity,
    fromDataToEntity
};
