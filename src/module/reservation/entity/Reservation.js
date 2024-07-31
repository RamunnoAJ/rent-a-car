module.exports = class Reservation {
    /**
     * @param {number} id
     * @param {string} fromDate
     * @param {string} toDate
     * @param {number} days
     * @param {boolean} babyChair
     * @param {boolean} snowChain
     * @param {string} paymentMethod
     * @param {number} totalPrice
     * @param {number} carId
     * @param {number} userId
     * @param {string} createdAt
     * @param {string} updatedAt
     */
    constructor(
        id,
        fromDate,
        toDate,
        days,
        babyChair,
        snowChain,
        paymentMethod,
        totalPrice,
        carId,
        userId,
        createdAt,
        updatedAt
    ) {
        this.id = id;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.days = days;
        this.babyChair = babyChair;
        this.snowChain = snowChain;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.carId = carId;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
};
