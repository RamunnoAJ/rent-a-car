const Reservation = require("../../entity/Reservation");

module.exports = function createTestReservation(id) {
    return new Reservation(
        id,
        "2020-10-05T15:00",
        "2020-10-08T15:00",
        3,
        true,
        true,
        "Cash",
        3000
    );
};
