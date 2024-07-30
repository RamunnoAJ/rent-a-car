const Car = require("../entity/Car");
const CarNotDefinedError = require("./error/carNotDefinedError");
const CarIdNotDefinedError = require("./error/carIdNotDefinedError");

module.exports = class CarService {
    /**
     * @param {import("../repository/abstractCarRepository")} carRepository
     */
    constructor(carRepository) {
        this.carRepository = carRepository;
    }

    /**
     * @param {Car} car
     */
    async save(car) {
        if (car === undefined) {
            throw new CarNotDefinedError();
        }

        return this.carRepository.save(car);
    }

    /**
     * @param {number} id
     */
    async getById(id) {
        if (id === undefined) {
            throw new CarIdNotDefinedError();
        }

        return this.carRepository.getById(id);
    }

    async getAll() {
        return this.carRepository.getAll();
    }

    /**
     * @param {Car} car
     */
    async delete(car) {
        if (car === undefined) {
            throw new CarNotDefinedError();
        }

        return await this.carRepository.delete(car);
    }
};
