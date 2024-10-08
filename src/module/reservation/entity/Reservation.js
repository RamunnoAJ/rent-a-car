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
     * @param {string} createdAt
     * @param {string} updatedAt
     * @param {import("../../cars/entity/Car")} car
     * @param {import("../../user/entity/User")} user
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
        createdAt,
        updatedAt,
        car,
        user
    ) {
        this.id = id;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.days = days;
        this.babyChair = babyChair;
        this.snowChain = snowChain;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.car = car;
        this.user = user;
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

    getTotalDays() {
        let days = 0;

        const date1 = new Date(this.fromDate);
        const date2 = new Date(this.toDate);
        const diffInMillis = Math.abs(date2 - date1);
        days = Math.ceil(diffInMillis / (1000 * 60 * 60 * 24));

        this.days = days;
    }
};
