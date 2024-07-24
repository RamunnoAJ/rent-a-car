const UserIdNotDefinedError = require("../error/userIdNotDefinedError");
const UserNotDefinedError = require("../error/userNotDefinedError");
const UserService = require("../userService");

describe("userService", () => {
    const repositoryMock = {
        save: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn()
    };

    const service = new UserService(repositoryMock);

    it("should call the save method from the repository once when saving from the service", () => {
        service.save({});
        expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the save method without a user", () => {
        expect(service.save).rejects.toThrow(UserNotDefinedError);
    });

    it("should call the getById method from the repository once when querying from the service", () => {
        service.getById(1);
        expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the getById method without an id", () => {
        expect(service.getById).rejects.toThrow(UserIdNotDefinedError);
    });

    it("should call the getAll method from the repository once when querying all from the service", () => {
        service.getAll();
        expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
    });
});
