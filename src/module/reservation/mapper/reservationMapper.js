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
function fromDataToEntity({
    id,
    "from-date": fromDate,
    "to-date": toDate,
    days,
    "baby-chair": babyChair,
    "snow-chain": snowChain,
    "payment-method": paymentMethod,
    "total-price": totalPrice,
    car,
    user
}) {
    return new Reservation(
        id,
        fromDate,
        toDate,
        days,
        Number(babyChair),
        Number(snowChain),
        paymentMethod,
        totalPrice,
        null,
        null,
        car,
        user
    );
}

module.exports = {
    fromDbToEntity,
    fromDataToEntity
};
