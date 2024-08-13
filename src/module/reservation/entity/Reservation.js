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
     * @param {import("../../cars/entity/Car")} car
     * @param {import("../../user/entity/User")} user
     * @param {string} createdAt
     * @param {string} updatedAt
     * @param {string} deletedAt
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
        car,
        user,
        createdAt,
        updatedAt,
        deletedAt
    ) {
        this.id = id;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.days = days;
        this.babyChair = babyChair;
        this.snowChain = snowChain;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.car = car;
        this.user = user;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    getTotalPrice() {
        let price = this.days * this.car.price;

        if (this.babyChair) {
            price += 10000;
        }

        if (this.snowChain) {
            price += 30000;
        }

        this.totalPrice = price;
    }
};
