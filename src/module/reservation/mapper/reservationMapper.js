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
    fk_car_id,
    fk_user_id
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
        fk_car_id,
        fk_user_id
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
