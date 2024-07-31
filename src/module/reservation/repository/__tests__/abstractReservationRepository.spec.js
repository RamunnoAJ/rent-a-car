/* eslint max-classes-per-file: "off" */

const AbstractReservationRepository = require("../abstractReservationRepository");
const AbstractReservationRepositoryError = require("../error/abstractReservationRepositoryError");
const MethodNotImplementedError = require("../error/methodNotImplementedError");

describe("Abstract reservation repository", () => {
    it("cannot create a new instance of AbstractReservationRepository directly", () => {
        let repoInstance;
        try {
            repoInstance = new AbstractReservationRepository();
        } catch (e) {
            expect(e).toBeInstanceOf(AbstractReservationRepositoryError);
        } finally {
            expect(repoInstance).toBeUndefined();
        }
    });

    it("can create a new instance of a class that inherits from AbstractReservationRepository", () => {
        const ConcreteRepository = class extends AbstractReservationRepository {};
        const respositoryInstance = new ConcreteRepository();
        expect(respositoryInstance).toBeInstanceOf(ConcreteRepository);
        expect(respositoryInstance).toBeInstanceOf(
            AbstractReservationRepository
        );
    });

    it("calling base methods without implementation throws an error", () => {
        const ConcreteRepository = class extends AbstractReservationRepository {};
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
