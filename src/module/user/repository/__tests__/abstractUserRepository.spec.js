/* eslint max-classes-per-file: "off" */

const AbstractUserRepository = require("../abstractUserRepository");
const AbstractUserRepositoryError = require("../error/abstractUserRepositoryError");
const MethodNotImplementedError = require("../error/methodNotImplementedError");

describe("Abstract user repository", () => {
    it("cannot create a new instance of AbstractUserRepository directly", () => {
        let repoInstance;
        try {
            repoInstance = new AbstractUserRepository();
        } catch (e) {
            expect(e).toBeInstanceOf(AbstractUserRepositoryError);
        } finally {
            expect(repoInstance).toBeUndefined();
        }
    });

    it("can create a new instance of a class that inherits from AbstractUserRepository", () => {
        const ConcreteRepository = class extends AbstractUserRepository {};
        const respositoryInstance = new ConcreteRepository();
        expect(respositoryInstance).toBeInstanceOf(ConcreteRepository);
        expect(respositoryInstance).toBeInstanceOf(AbstractUserRepository);
    });

    it("calling base methods without implementation throws an error", () => {
        const ConcreteRepository = class extends AbstractUserRepository {};
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
    });
});
