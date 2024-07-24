module.exports = class User {
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
     */
    constructor(
        id,
        createdAt,
        updatedAt,
        email,
        token,
        phone,
        name,
        nationality,
        address,
        driverLicense,
        role
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.email = email;
        this.token = token;
        this.phone = phone;
        this.name = name;
        this.nationality = nationality;
        this.address = address;
        this.driverLicense = driverLicense;
        this.role = role;
    }
};
