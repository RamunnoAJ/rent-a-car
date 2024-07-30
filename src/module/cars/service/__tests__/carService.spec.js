const CarService = require("../carService");
const CarIdNotDefinedError = require("../error/carIdNotDefinedError");
const CarNotDefinedError = require("../error/carNotDefinedError");

describe("carService", () => {
    const repositoryMock = {
        save: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn()
    };

    const service = new CarService(repositoryMock);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call the save method from the repository once when saving from the service", async () => {
        await service.save({});
        expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the save method without a car", () => {
        expect(service.save).rejects.toThrow(CarNotDefinedError);
    });

    it("should call the getById method from the repository once when querying from the service", () => {
        service.getById(1);
        expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the getById method without an id", () => {
        expect(service.getById).rejects.toThrow(CarIdNotDefinedError);
    });

    it("should call the getAll method from the repository once when querying all from the service", () => {
        service.getAll();
        expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
    });

    it("should call the delete method from the repository once when deleting from the service", async () => {
        await service.delete({});
        expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the delete method from the repository without passing a car", async () => {
        expect(service.delete).rejects.toThrow(CarNotDefinedError);
    });
});
