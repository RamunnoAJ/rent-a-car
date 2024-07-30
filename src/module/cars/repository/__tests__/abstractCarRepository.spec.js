/* eslint max-classes-per-file: "off" */

const AbstractCarRepository = require("../abstractCarRepository");
const AbstractCarRepositoryError = require("../error/abstractCarRepositoryError");
const MethodNotImplementedError = require("../error/methodNotImplementedError");

describe("Abstract user repository", () => {
    it("cannot create a new instance of AbstractUserRepository directly", () => {
        let repoInstance;
        try {
            repoInstance = new AbstractCarRepository();
        } catch (e) {
            expect(e).toBeInstanceOf(AbstractCarRepositoryError);
        } finally {
            expect(repoInstance).toBeUndefined();
        }
    });

    it("can create a new instance of a class that inherits from AbstractCarRepository", () => {
        const ConcreteRepository = class extends AbstractCarRepository {};
        const respositoryInstance = new ConcreteRepository();
        expect(respositoryInstance).toBeInstanceOf(ConcreteRepository);
        expect(respositoryInstance).toBeInstanceOf(AbstractCarRepository);
    });

    it("calling base methods without implementation throws an error", () => {
        const ConcreteRepository = class extends AbstractCarRepository {};
        const respositoryInstance = new ConcreteRepository();

        expect(() => respositoryInstance.save()).rejects.toThrow(
            MethodNotImplementedError
        );
        expect(() => respositoryInstance.getById()).rejects.toThrow(
            MethodNotImplementedError
        );
        expect(() => respositoryInstance.getAll()).rejects.toThrow(
            MethodNotImplementedError
        );
        expect(() => respositoryInstance.delete()).rejects.toThrow(
            MethodNotImplementedError
        );
    });
});
