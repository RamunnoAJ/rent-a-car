const fs = require("fs");
const Sqlite3Database = require("better-sqlite3");
const UserRepository = require("../userRepository");
const User = require("../../../entity/User");

describe("userRepository", () => {
    let mockDb;

    beforeEach(() => {
        mockDb = new Sqlite3Database(":memory:");
        const migration = fs.readFileSync("./src/config/setup.sql", "utf-8");
        mockDb.exec(migration);
    });

    it("should return a new id after saving a new user", () => {
        const repository = new UserRepository(mockDb);
        const userId = repository.save(
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

        expect(userId).toEqual(1);
    });
});
