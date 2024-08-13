const Car = require("../entity/Car");

/**
 * @param {Object} formData
 * @returns {Car}
 */
function fromModelToEntity({
    id,
    brand,
    model,
    year,
    kms,
    color,
    air_conditioning,
    seats,
    transmission,
    price,
    createdAt = null,
    updatedAt = null,
    deletedAt = null
}) {
    return new Car(
        Number(id),
        brand,
        model,
        year,
        Number(kms),
        color,
        air_conditioning,
        seats,
        transmission,
        Number(price),
        createdAt,
        updatedAt,
        deletedAt
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
    fromModelToEntity,
    fromDataToEntity
};
