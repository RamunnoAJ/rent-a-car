const UserEmailNotDefinedError = require("../error/userEmailNotDefinedError");
const UserIdNotDefinedError = require("../error/userIdNotDefinedError");
const UserNotDefinedError = require("../error/userNotDefinedError");
const UserPasswordNotDefinedError = require("../error/userPasswordNotDefinedError");
const UserService = require("../userService");

describe("userService", () => {
    const repositoryMock = {
        save: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        getByEmail: jest.fn(),
        comparePasswords: jest.fn(),
        delete: jest.fn()
    };

    const bcryptMock = {
        genSalt: jest.fn(() => "fakeSalt"),
        hash: jest.fn(() => "hashedPassword"),
        compare: jest.fn()
    };

    const service = new UserService(repositoryMock, bcryptMock);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call the save method from the repository once when saving from the service", async () => {
        await service.save({});
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

    it("should call the getByEmail method from the repository once when querying from the service", () => {
        service.getByEmail("email@mail.com");
        expect(repositoryMock.getByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the getByEmail method without an email", () => {
        expect(service.getByEmail).rejects.toThrow(UserEmailNotDefinedError);
    });

    it("should return UserPasswordNotDefinedError when password is undefined", async () => {
        const result = await service.comparePasswords(
            undefined,
            "storedPassword"
        );
        expect(result).toBeInstanceOf(UserPasswordNotDefinedError);
    });

    it("should return true when passwords match", async () => {
        bcryptMock.compare.mockResolvedValue(true);
        const result = await service.comparePasswords(
            "password",
            "storedPassword"
        );
        expect(bcryptMock.compare).toHaveBeenCalledWith(
            "password",
            "storedPassword"
        );
        expect(result).toBe(true);
    });

    it("should return false when passwords do not match", async () => {
        bcryptMock.compare.mockResolvedValue(false);
        const result = await service.comparePasswords(
            "password",
            "storedPassword"
        );
        expect(bcryptMock.compare).toHaveBeenCalledWith(
            "password",
            "storedPassword"
        );
        expect(result).toBe(false);
    });

    it("should call the delete method from the repository once when deleting from the service", async () => {
        await service.delete({});
        expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when calling the delete method from the repository without passing a user", async () => {
        expect(service.delete).rejects.toThrow(UserNotDefinedError);
    });
});
