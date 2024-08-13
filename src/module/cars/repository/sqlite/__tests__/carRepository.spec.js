const CarRepository = require("../carRepository");
const carModel = require("../../../model/carModel");
const createTestCar = require("../../../controller/__tests__/cars.fixture");
const { Sequelize } = require("sequelize");
const CarNotDefinedError = require("../../error/carNotDefinedError");

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

    //it("should throw an error when searching for a car by id that doesn't exist", () => {
    //    const repository = new CarRepository(mockDb);
    //
    //    expect(() => {
    //        repository.getById(1);
    //    }).toThrow(CarNotFoundError);
    //});
    //
    //it("should return the right car when searching by id", () => {
    //    const repository = new CarRepository(mockDb);
    //    const newCar = repository.save(
    //        new Car(
    //            null,
    //            "brand",
    //            "model",
    //            "year",
    //            10000,
    //            "color",
    //            1,
    //            5,
    //            "transmission",
    //            249999.99
    //        )
    //    );
    //
    //    expect(newCar.id).toEqual(1);
    //
    //    const car = repository.getById(1);
    //    expect(car).toEqual(newCar);
    //});
    //
    //it("should return an array of cars when searching all", () => {
    //    const repository = new CarRepository(mockDb);
    //    const newCar1 = repository.save(
    //        new Car(
    //            null,
    //            "brand",
    //            "model",
    //            "year",
    //            10000,
    //            "color",
    //            1,
    //            5,
    //            "transmission",
    //            249999.99
    //        )
    //    );
    //
    //    const newCar2 = repository.save(
    //        new Car(
    //            null,
    //            "brand2",
    //            "model2",
    //            "year2",
    //            10002,
    //            "color2",
    //            0,
    //            4,
    //            "transmission2",
    //            249999.99
    //        )
    //    );
    //
    //    expect(repository.getAll()).toEqual([newCar1, newCar2]);
    //});
    //
    //it("should return true when deleting a car", () => {
    //    const repository = new CarRepository(mockDb);
    //    const newCar = repository.save(
    //        new Car(
    //            null,
    //            "brand",
    //            "model",
    //            "year",
    //            10000,
    //            "color",
    //            1,
    //            5,
    //            "transmission",
    //            249999.99
    //        )
    //    );
    //
    //    expect(newCar.id).toEqual(1);
    //
    //    const car = repository.delete(newCar);
    //    expect(car).toEqual(true);
    //});
    //
    //it("should throw an error when deleting a car that not exists", () => {
    //    const repository = new CarRepository(mockDb);
    //    const newCar = new Car(
    //        null,
    //        "brand",
    //        "model",
    //        "year",
    //        10000,
    //        "color",
    //        1,
    //        5,
    //        "transmission",
    //        249999.99
    //    );
    //
    //    expect(() => repository.delete(newCar)).toThrow(CarNotFoundError);
    //});
});
