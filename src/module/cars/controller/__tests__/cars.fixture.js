const Car = require("../../entity/Car");

module.exports = function createTestCar(id) {
    return new Car(
        id,
        "Volkswagen",
        "Taos",
        "2024",
        0,
        "Blue",
        false,
        5,
        "Semi-Automatic",
        "3000",
        undefined,
        undefined,
        undefined
    );
};
