const AbstractCarRepository = require("../abstractCarRepository");
const CarNotFoundError = require("../error/carNotFoundError");
const CarNotDefinedError = require("../error/carNotDefinedError");
const { fromModelToEntity } = require("../../mapper/carMapper");
const Car = require("../../entity/Car");

module.exports = class CarRepository extends AbstractCarRepository {
    /** @param {typeof import("../../model/carModel")} carModel */
    constructor(carModel) {
        super();
        this.carModel = carModel;
    }

    /**
     * @param {import("../../entity/Car")} car
     * @returns {import("../../entity/Car")}
     */
    async save(car) {
        if (!(car instanceof Car)) {
            throw new CarNotDefinedError();
        }

        const carInstance = this.carModel.build(car, {
            isNewRecord: !car.id
        });

        await carInstance.save();
        return fromModelToEntity(carInstance);
    }

    /**
     * @param {number} id
     * @returns {import("../../entity/Car")}
     */
    getById(id) {
        const car = this.databaseAdapter
            .prepare(
                `
            SELECT
                id,
                brand,
                model,
                year,
                kms,
                color,
                air_conditioning,
                seats,
                transmission,
                price,
                created_at,
                updated_at
            FROM cars WHERE id = ?
        `
            )
            .get(id);

        if (car === undefined) {
            throw new CarNotFoundError(`Couldn't find car with ID: ${id}`);
        }

        return fromDbToEntity(car);
    }

    /** @returns {Array<import("../../entity/Car")>} */
    getAll() {
        const cars = this.databaseAdapter
            .prepare(
                `
                SELECT
                    id,
                    brand,
                    model,
                    year,
                    kms,
                    color,
                    air_conditioning,
                    seats,
                    transmission,
                    price,
                    created_at,
                    updated_at
                FROM cars
            `
            )
            .all();

        return cars.map(car => fromDbToEntity(car));
    }

    /**
     * @param {import("../../entity/Car")} car
     * @returns {boolean}
     */
    delete(car) {
        if (!car || !car.id) {
            throw new CarNotFoundError();
        }

        this.databaseAdapter
            .prepare("DELETE FROM cars WHERE id = ?")
            .run(car.id);

        return true;
    }
};
