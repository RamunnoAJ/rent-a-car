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

module.exports = {
    fromDbToEntity
};
