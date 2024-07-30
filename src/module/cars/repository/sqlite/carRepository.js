const AbstractCarRepository = require("../abstractCarRepository");
const CarNotFoundError = require("../error/carNotFoundError");
const { fromDbToEntity } = require("../../mapper/carMapper");

module.exports = class CarRepository extends AbstractCarRepository {
    /** @param {import("better-sqlite3").Database} databaseAdapater */
    constructor(databaseAdapater) {
        super();
        this.databaseAdapter = databaseAdapater;
    }

    /**
     * @param {import("../../entity/Car")} car
     * @returns {import("../../entity/Car")}
     */
    save(car) {
        let id;
        const isUpdate = car.id;

        if (isUpdate) {
            id = car.id;

            const statement = this.databaseAdapter.prepare(`
                UPDATE cars SET
                    brand = ?,
                    model = ?,
                    year = ?,
                    kms = ?,
                    color = ?,
                    air_conditioning = ?,
                    seats = ?,
                    transmission = ?,
                    price = ?
                WHERE id = ?
            `);

            const params = [
                car.brand,
                car.model,
                car.year,
                car.kms,
                car.color,
                car.airConditioning,
                car.seats,
                car.transmission,
                car.price,
                car.id
            ];

            statement.run(params);
        } else {
            const statement = this.databaseAdapter.prepare(`
                INSERT INTO cars(
                    brand,
                    model,
                    year,
                    kms,
                    color,
                    air_conditioning,
                    seats,
                    transmission,
                    price
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const result = statement.run(
                car.brand,
                car.model,
                car.year,
                car.kms,
                car.color,
                car.airConditioning,
                car.seats,
                car.transmission,
                car.price
            );

            id = result.lastInsertRowid;
        }

        return this.getById(id);
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
