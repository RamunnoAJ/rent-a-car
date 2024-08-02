const Reservation = require("../entity/Reservation");

/**
 * @param {Object} formData
 * @returns {Reservation}
 */
function fromDbToEntity({
    id,
    from_date,
    to_date,
    days,
    baby_chair,
    snow_chain,
    payment_method,
    total_price,
    created_at,
    updated_at,
    car,
    user
}) {
    return new Reservation(
        id,
        from_date,
        to_date,
        days,
        baby_chair,
        snow_chain,
        payment_method,
        total_price,
        created_at,
        updated_at,
        car,
        user
    );
}

/**
 * @param {Object} formData
 * @returns {Reservation}
 */
function fromDataToEntity({}) {
    return new Reservation();
}

module.exports = {
    fromDbToEntity,
    fromDataToEntity
};
