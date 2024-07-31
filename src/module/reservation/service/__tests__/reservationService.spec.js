const ReservationService = require("../reservationService");
const ReservationIdNotDefinedError = require("../error/reservationIdNotDefinedError");
const ReservationNotDefinedError = require("../error/reservationNotDefinedError");

describe("reservationService", () => {
    const repositoryMock = {
        save: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn()
    };

    const service = new ReservationService(repositoryMock);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call the save method from the repository once when saving from the service", async () => {
        await service.save({});
        expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the save method without a reservation", () => {
        expect(service.save).rejects.toThrow(ReservationNotDefinedError);
    });

    it("should call the getById method from the repository once when querying from the service", () => {
        service.getById(1);
        expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the getById method without an id", () => {
        expect(service.getById).rejects.toThrow(ReservationIdNotDefinedError);
    });

    it("should call the getAll method from the repository once when querying all from the service", () => {
        service.getAll();
        expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
    });

    it("should call the delete method from the repository once when deleting from the service", async () => {
        await service.delete({});
        expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the delete method from the repository without passing a reservation", async () => {
        expect(service.delete).rejects.toThrow(ReservationNotDefinedError);
    });
});
