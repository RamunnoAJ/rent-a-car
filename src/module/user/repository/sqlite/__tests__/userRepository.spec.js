const fs = require("fs");
const Sqlite3Database = require("better-sqlite3");
const UserRepository = require("../userRepository");
const User = require("../../../entity/User");
const UserNotFoundError = require("../../error/userNotFoundError");

describe("userRepository", () => {
    let mockDb;

    beforeEach(() => {
        mockDb = new Sqlite3Database(":memory:");
        const migration = fs.readFileSync("./src/config/setup.sql", "utf-8");
        mockDb.exec(migration);
    });

    it("should return a new id after saving a new user", () => {
        const repository = new UserRepository(mockDb);
        const newUser = new User(
            null,
            null,
            null,
            "test@mail.com",
            "token",
            "phone",
            "name",
            "nationality",
            "address",
            "driverLicense",
            "role"
        );

        const user = repository.save(newUser);
        expect(user.id).toEqual(1);
    });

    it("should update the fields of an existing user", () => {
        const repository = new UserRepository(mockDb);
        let user = repository.save(
            new User(
                null,
                null,
                null,
                "test@mail.com",
                "token",
                "phone",
                "name",
                "nationality",
                "address",
                "driverLicense",
                "role"
            )
        );
        expect(user.id).toEqual(1);

        user = repository.save(
            new User(
                1,
                null,
                null,
                "test@mail.com",
                "token",
                "phone",
                "new name",
                "nationality",
                "address",
                "driverLicense",
                "role"
            )
        );

        expect(user.id).toEqual(1);
        expect(user.name).toEqual("new name");
    });

    it("should throw an error when saving a user that doesn't exist", () => {
        const repository = new UserRepository(mockDb);

        expect(() => {
            repository.save(
                new User(
                    1,
                    null,
                    null,
                    "test@mail.com",
                    "token",
                    "phone",
                    "new name",
                    "nationality",
                    "address",
                    "driverLicense",
                    "role"
                )
            );
        }).toThrow(UserNotFoundError);
    });

    it("should throw an error when searching for a user that doesn't exist", () => {
        const repository = new UserRepository(mockDb);

        expect(() => {
            repository.getById(1);
        }).toThrow(UserNotFoundError);
    });

    it("should return the right user when searching by id", () => {
        const repository = new UserRepository(mockDb);
        const newUser = repository.save(
            new User(
                null,
                null,
                null,
                "test@mail.com",
                "token",
                "phone",
                "name",
                "nationality",
                "address",
                "driverLicense",
                "role"
            )
        );

        expect(newUser.id).toEqual(1);

        const user = repository.getById(1);
        expect(user).toEqual(newUser);
    });

    it("should return an array of users when searching all users", () => {
        const repository = new UserRepository(mockDb);
        const newUser1 = repository.save(
            new User(
                null,
                null,
                null,
                "test1@mail.com",
                "token1",
                "phone1",
                "name1",
                "nationality1",
                "address1",
                "driverLicense1",
                "role1"
            )
        );

        const newUser2 = repository.save(
            new User(
                null,
                null,
                null,
                "test2@mail.com",
                "token2",
                "phone2",
                "name2",
                "nationality2",
                "address2",
                "driverLicense2",
                "role2"
            )
        );

        expect(repository.getAll()).toEqual([newUser1, newUser2]);
    });
});
