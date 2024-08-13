const createTestUser = require("../../../controller/__tests__/user.fixture");
const UserRepository = require("../userRepository");
const userModel = require("../../../model/userModel");
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
});
