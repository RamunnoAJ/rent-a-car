const {
    fromModelToEntity: fromCarModelToEntity
} = require("../../cars/mapper/carMapper");
const {
    fromModelToEntity: fromUserModelToEntity
} = require("../../user/mapper/userMapper");
const Reservation = require("../entity/Reservation");

/**
 * @param {Object} formData
 * @returns {Reservation}
 */
function fromModelToEntity({
    id,
    fromDate,
    toDate,
    days,
    babyChair,
    snowChain,
    paymentMethod,
    totalPrice,
    car,
    user,
    createdAt = null,
    updatedAt = null,
    deletedAt = null
}) {
    return new Reservation(
        id,
        fromDate,
        toDate,
        days,
        babyChair,
        snowChain,
        paymentMethod,
        totalPrice,
        car ? fromCarModelToEntity(car) : {},
        user ? fromUserModelToEntity(user) : {},
        createdAt,
        updatedAt,
        deletedAt
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
        babyChair,
        snowChain,
        paymentMethod,
        totalPrice,
        car,
        user
    );
}

module.exports = {
    fromModelToEntity,
    fromDataToEntity
};
