const createTestUser = require("../../../controller/__tests__/user.fixture");
const UserRepository = require("../userRepository");
const userModel = require("../../../model/userModel");
const UserEmailNotDefinedError = require("../../error/userEmailNotDefinedError");
const UserIdNotDefinedError = require("../../error/userIdNotDefinedError");
const UserNotDefinedError = require("../../error/userNotDefinedError");
const UserNotFoundError = require("../../error/userNotFoundError");
const { Sequelize } = require("sequelize");

describe("userRepository", () => {
    /** @type {Sequelize} */
    let sequelize;
    /** @type {UserRepository} */
    let userRepository;
    /** @type {userModel} */
    let UserModel;

    beforeEach(done => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        });
        UserModel = userModel.setup(sequelize);
        userRepository = new UserRepository(UserModel);
        sequelize.sync({ force: true }).then(() => done());
    });

    it("should return a new id after saving a new user", async () => {
        const userWithoutId = createTestUser();
        const { id, name, email } = await userRepository.save(userWithoutId);
        expect(id).toEqual(1);
        expect(name).toEqual("Marcos Peralta");
        expect(email).toEqual("johndoe@gmail.com");
    });

    it("should update the fields of an existing user", async () => {
        const userWithoutId = createTestUser();
        const userWithId = createTestUser(1);

        userWithId.name = "Raul Almeja";
        userWithId.email = "raulalmeja@gmail.com";

        const newUser = await userRepository.save(userWithoutId);
        const newUserTwo = await userRepository.save(userWithoutId);
        expect(newUser.id).toEqual(1);
        expect(newUserTwo.id).toEqual(2);

        const updatedUser = await userRepository.save(userWithId);
        expect(updatedUser.id).toEqual(1);
        expect(updatedUser.name).toEqual("Raul Almeja");
        expect(updatedUser.email).toEqual("raulalmeja@gmail.com");
    });

    it("should throw an error when no users is passed", async () => {
        expect(await userRepository.save).rejects.toThrow(UserNotDefinedError);
    });

    it("should return the right user when searching by id", async () => {
        const userWithoutId = createTestUser();
        await userRepository.save(userWithoutId);

        const user = await userRepository.getById(1);
        expect(user.id).toEqual(1);
        expect(user.name).toEqual("Marcos Peralta");
        expect(user.email).toEqual("johndoe@gmail.com");
    });

    it("should throw an error when searching for a user by id that doesn't exist", async () => {
        await expect(() => userRepository.getById(1)).rejects.toThrow(
            UserNotFoundError
        );
    });

    it("should throw an error when searching for a user without an id", async () => {
        await expect(userRepository.getById).rejects.toThrow(
            UserIdNotDefinedError
        );
    });

    it("should return an array of users when searching all", async () => {
        const userWithoutId = createTestUser();
        await userRepository.save(userWithoutId);
        await userRepository.save(userWithoutId);
        await userRepository.save(userWithoutId);

        const users = await userRepository.getAll();
        expect(users).toHaveLength(3);
        expect(users[0].id).toEqual(1);
        expect(users[1].id).toEqual(2);
        expect(users[2].id).toEqual(3);
    });

    it("should return the right user when searching by email", async () => {
        const userWithoutId = createTestUser();
        const newUser = await userRepository.save(userWithoutId);

        const user = await userRepository.getByEmail(newUser.email);
        expect(user.id).toEqual(1);
        expect(user.name).toEqual("Marcos Peralta");
        expect(user.email).toEqual("johndoe@gmail.com");
    });

    it("should throw an error when searching for a user without passing email", async () => {
        await expect(userRepository.getByEmail()).rejects.toThrow(
            UserEmailNotDefinedError
        );
    });

    it("should throw an error when searching for a user by email that doesn't exist", async () => {
        await expect(
            userRepository.getByEmail("email@test.com")
        ).rejects.toThrow(UserNotFoundError);
    });

    it("should return true when deleting a user", async () => {
        const userWithoutId = createTestUser();
        const user = await userRepository.save(userWithoutId);

        let users = await userRepository.getAll();

        expect(users).toHaveLength(1);
        const deletedUser = userRepository.delete(user);
        expect(deletedUser).toBeTruthy();

        users = await userRepository.getAll();
        expect(users).toHaveLength(0);
    });

    it("should throw an error when deleting a user that not exists", async () => {
        const userWithoutId = createTestUser();
        await userRepository.save(userWithoutId);
        await userRepository.save(userWithoutId);

        const userThree = createTestUser(3);
        const deletedUser = await userRepository.delete(userThree);
        expect(deletedUser).toBeFalsy();
    });

    it("should throw an error when deleting a user that is not an instance of the User entity", async () => {
        const user = { id: 1 };
        await expect(userRepository.delete(user)).rejects.toThrow(
            UserNotDefinedError
        );
    });
});
