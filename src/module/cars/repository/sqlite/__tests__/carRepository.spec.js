const fs = require("fs");
const Sqlite3Database = require("better-sqlite3");
const CarRepository = require("../carRepository");
const Car = require("../../../entity/Car");
const CarNotFoundError = require("../../error/carNotFoundError");

describe("carRepository", () => {
    let mockDb;

    beforeEach(() => {
        mockDb = new Sqlite3Database(":memory:");
        const migration = fs.readFileSync("./src/config/setup.sql", "utf-8");
        mockDb.exec(migration);
    });

    it("should return a new id after saving a new car", () => {
        const repository = new CarRepository(mockDb);
        const newCar = new Car(
            null,
            "brand",
            "model",
            "year",
            10000,
            "color",
            1,
            5,
            "transmission",
            249999.99
        );

        const car = repository.save(newCar);
        expect(car.id).toEqual(1);
    });

    it("should update the fields of an existing car", () => {
        const repository = new CarRepository(mockDb);
        let car = repository.save(
            new Car(
                null,
                "brand",
                "model",
                "year",
                10000,
                "color",
                1,
                5,
                "transmission",
                249999.99
            )
        );
        expect(car.id).toEqual(1);

        car = repository.save(
            new Car(
                1,
                "new brand",
                "model",
                "year",
                10000,
                "color",
                1,
                5,
                "transmission",
                249999.99
            )
        );

        expect(car.id).toEqual(1);
        expect(car.brand).toEqual("new brand");
    });

    it("should throw an error when saving a car that doesn't exist", () => {
        const repository = new CarRepository(mockDb);

        expect(() => {
            repository.save(
                new Car(
                    1,
                    "brand",
                    "model",
                    "year",
                    10000,
                    "color",
                    1,
                    5,
                    "transmission",
                    249999.99
                )
            );
        }).toThrow(CarNotFoundError);
    });

    it("should throw an error when searching for a car by id that doesn't exist", () => {
        const repository = new CarRepository(mockDb);

        expect(() => {
            repository.getById(1);
        }).toThrow(CarNotFoundError);
    });

    it("should return the right car when searching by id", () => {
        const repository = new CarRepository(mockDb);
        const newCar = repository.save(
            new Car(
                null,
                "brand",
                "model",
                "year",
                10000,
                "color",
                1,
                5,
                "transmission",
                249999.99
            )
        );

        expect(newCar.id).toEqual(1);

        const car = repository.getById(1);
        expect(car).toEqual(newCar);
    });

    it("should return an array of cars when searching all", () => {
        const repository = new CarRepository(mockDb);
        const newCar1 = repository.save(
            new Car(
                null,
                "brand",
                "model",
                "year",
                10000,
                "color",
                1,
                5,
                "transmission",
                249999.99
            )
        );

        const newCar2 = repository.save(
            new Car(
                null,
                "brand2",
                "model2",
                "year2",
                10002,
                "color2",
                0,
                4,
                "transmission2",
                249999.99
            )
        );

        expect(repository.getAll()).toEqual([newCar1, newCar2]);
    });

    it("should return true when deleting a car", () => {
        const repository = new CarRepository(mockDb);
        const newCar = repository.save(
            new Car(
                null,
                "brand",
                "model",
                "year",
                10000,
                "color",
                1,
                5,
                "transmission",
                249999.99
            )
        );

        expect(newCar.id).toEqual(1);

        const car = repository.delete(newCar);
        expect(car).toEqual(true);
    });

    it("should throw an error when deleting a car that not exists", () => {
        const repository = new CarRepository(mockDb);
        const newCar = new Car(
            null,
            "brand",
            "model",
            "year",
            10000,
            "color",
            1,
            5,
            "transmission",
            249999.99
        );

        expect(() => repository.delete(newCar)).toThrow(CarNotFoundError);
    });
});
