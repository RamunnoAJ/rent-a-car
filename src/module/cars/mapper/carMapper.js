const Car = require("../entity/Car");

/**
 * @param {Object} formData
 * @returns {Car}
 */
function fromDbToEntity({
    id,
    brand,
    model,
    year,
    kms,
    color,
    air_conditioning,
    seats,
    transmission,
    price
}) {
    return new Car(
        id,
        brand,
        model,
        year,
        kms,
        color,
        air_conditioning,
        seats,
        transmission,
        price
    );
}

/**
 * @param {Object} formData
 * @returns {Car}
 */
function fromDataToEntity({
    id,
    brand,
    model,
    year,
    kms,
    color,
    "air-conditioning": airConditioning,
    seats,
    transmission,
    price
}) {
    return new Car(
        id,
        brand,
        model,
        year,
        kms,
        color,
        airConditioning,
        seats,
        transmission,
        price
    );
}

module.exports = {
    fromDbToEntity,
    fromDataToEntity
};
