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

    it("should ensure authentication when an existing user is passed", () => {
        const ConcreteController = class extends AbstractController {};
        const controller = new ConcreteController();

        const req = {
            session: {
                user: { id: 1, username: "testuser" }
            }
        };
        const res = {
            redirect: jest.fn()
        };
        const next = jest.fn();

        controller.ensureAuthenticated(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.redirect).not.toHaveBeenCalled();
    });

    it("should redirect to login when no user is authenticated", () => {
        const ConcreteController = class extends AbstractController {};
        const controller = new ConcreteController();

        const req = {
            session: {}
        };
        const res = {
            redirect: jest.fn()
        };
        const next = jest.fn();

        controller.ensureAuthenticated(req, res, next);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
        expect(next).not.toHaveBeenCalled();
    });
});
