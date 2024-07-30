module.exports = class Car {
    /**
     * @param {number} id
     * @param {string} brand
     * @param {string} model
     * @param {string} year
     * @param {number} kms
     * @param {string} color
     * @param {boolean} airConditioning
     * @param {number} seats
     * @param {string} transmission
     * @param {number} price
     * @param {string} createdAt
     * @param {string} updatedAt
     */
    constructor(
        id,
        brand,
        model,
        year,
        kms,
        color,
        airConditioning,
        seats,
        transmission,
        price,
        createdAt,
        updatedAt
    ) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.kms = kms;
        this.color = color;
        this.airConditioning = airConditioning;
        this.seats = seats;
        this.transmission = transmission;
        this.price = price;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
};
