const CarRepository = require("../carRepository");
const carModel = require("../../../model/carModel");
const createTestCar = require("../../../controller/__tests__/cars.fixture");
const { Sequelize } = require("sequelize");
const CarIdNotDefinedError = require("../../error/carIdNotDefinedError");
const CarNotDefinedError = require("../../error/carNotDefinedError");
const CarNotFoundError = require("../../error/carNotFoundError");

describe("carRepository", () => {
    /** @type {Sequelize} */
    let sequelize;
    /** @type {CarRepository} */
    let carRepository;
    /** @type {carModel} */
    let CarModel;

    beforeEach(done => {
        sequelize = new Sequelize("sqlite::memory");
        CarModel = carModel.setup(sequelize);
        carRepository = new CarRepository(CarModel);
        sequelize.sync({ force: true }).then(() => done());
    });

    it("should return a new id after saving a new car", async () => {
        const carWithoutId = createTestCar();
        const { id, brand, model } = await carRepository.save(carWithoutId);
        expect(id).toEqual(1);
        expect(brand).toEqual("Volkswagen");
        expect(model).toEqual("Taos");
    });

    it("should update the fields of an existing car", async () => {
        const carWithoutId = createTestCar();
        const carWithId = createTestCar(1);

        carWithId.brand = "Toyota";
        carWithId.model = "Corolla";

        const newCar = await carRepository.save(carWithoutId);
        const newCarTwo = await carRepository.save(carWithoutId);
        expect(newCar.id).toEqual(1);
        expect(newCarTwo.id).toEqual(2);

        const updatedCar = await carRepository.save(carWithId);
        expect(updatedCar.id).toEqual(1);
        expect(updatedCar.brand).toEqual("Toyota");
        expect(updatedCar.model).toEqual("Corolla");
    });

    it("should throw an error when saving a car that doesn't exist", async () => {
        const car = { id: 1, brand: "Volkswagen", model: "Taos" };
        await expect(carRepository.save(car)).rejects.toThrow(
            CarNotDefinedError
        );
    });

    it("should return the right car when searching by id", async () => {
        const carWithoutId = createTestCar();
        await carRepository.save(carWithoutId);

        const car = await carRepository.getById(1);
        expect(car.id).toEqual(1);
        expect(car.brand).toEqual("Volkswagen");
        expect(car.model).toEqual("Taos");
    });

    it("should throw an error when searching for a car by id that doesn't exist", async () => {
        await expect(carRepository.getById(1)).rejects.toThrow(
            CarNotFoundError
        );
    });

    it("should throw an error when searching for a car without an id", async () => {
        await expect(carRepository.getById()).rejects.toThrow(
            CarIdNotDefinedError
        );
    });

    it("should return an array of cars when searching all", async () => {
        const carWithoutId = createTestCar();
        await carRepository.save(carWithoutId);
        await carRepository.save(carWithoutId);
        await carRepository.save(carWithoutId);

        const cars = await carRepository.getAll();
        expect(cars).toHaveLength(3);
        expect(cars[0].id).toEqual(1);
        expect(cars[1].id).toEqual(2);
        expect(cars[2].id).toEqual(3);
    });

    it("should return true when deleting a car", async () => {
        const carWithoutId = createTestCar();
        const car = await carRepository.save(carWithoutId);

        let cars = await carRepository.getAll();

        expect(cars).toHaveLength(1);
        const deletedCar = carRepository.delete(car);
        expect(deletedCar).toBeTruthy();

        cars = await carRepository.getAll();
        expect(cars).toHaveLength(0);
    });

    it("should throw an error when deleting a car that not exists", async () => {
        const carWithoutId = createTestCar();
        await carRepository.save(carWithoutId);
        await carRepository.save(carWithoutId);

        const carThree = createTestCar(3);
        const deletedCar = await carRepository.delete(carThree);
        expect(deletedCar).toBeFalsy();
    });

    it("should throw an error when deleting a car that is not an instance of the Car entity", async () => {
        const car = { id: 1 };
        await expect(carRepository.delete(car)).rejects.toThrow(
            CarNotDefinedError
        );
    });
});
