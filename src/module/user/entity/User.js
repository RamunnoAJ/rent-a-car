module.exports = class User {
    /**
     * @param {number} id
     * @param {string} email
     * @param {string} token
     * @param {string} phone
     * @param {string} name
     * @param {string} nationality
     * @param {string} address
     * @param {string} driverLicense
     * @param {string} role
     * @param {string} createdAt
     * @param {string} updatedAt
     * @param {string} deletedAt
     */
    constructor(
        id,
        email,
        token,
        phone,
        name,
        nationality,
        address,
        driverLicense,
        role,
        createdAt,
        updatedAt,
        deletedAt
    ) {
        this.id = id;
        this.email = email;
        this.token = token;
        this.phone = phone;
        this.name = name;
        this.nationality = nationality;
        this.address = address;
        this.driverLicense = driverLicense;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
};
