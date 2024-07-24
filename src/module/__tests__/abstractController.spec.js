const AbstractController = require("../abstractController");
const AbstractControllerrError = require("../error/abstractControllerError");

describe("Abstract controller", () => {
    it("cannot create a new instance of AbstractController directly", () => {
        try {
            new AbstractController();
        } catch (e) {
            expect(e).toBeInstanceOf(AbstractControllerrError);
        }
    });

    it("can create a new instance of a class that inherits from AbstractController", () => {
        const ConcreteController = class extends AbstractController {};
        expect(new ConcreteController()).toBeInstanceOf(AbstractController);
    });
});
