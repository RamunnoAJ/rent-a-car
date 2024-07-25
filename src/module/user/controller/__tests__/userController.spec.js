const { fromDataToEntity } = require("../../mapper/userMapper");
const UserController = require("../userController");

describe("userController", () => {
    const serviceMock = {
        save: jest.fn()
    };

    const controller = new UserController(serviceMock);

    it("Configure the routes correctly", () => {
        const app = {
            get: jest.fn(),
            post: jest.fn()
        };
        controller.configureRoutes(app);
    });

    it("registerForm renders register.html", () => {
        const renderMock = jest.fn();

        controller.registerForm(
            { session: { errors: [], messages: [] } },
            { render: renderMock }
        );

        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith("user/view/register.html", {
            errors: []
        });
    });

    it("should create a new user when registering correctly", async () => {
        const redirectMock = jest.fn();
        const bodyMock = {
            email: undefined,
            password: undefined,
            phone: undefined,
            name: undefined,
            country: undefined,
            address: undefined,
            "driver-license": undefined
        };

        await controller.register(
            { body: bodyMock, session: {} },
            { redirect: redirectMock }
        );

        expect(serviceMock.save).toHaveBeenCalledTimes(1);
        expect(serviceMock.save).toHaveBeenCalledWith(
            fromDataToEntity(bodyMock)
        );
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith(201, "/login");
    });

    it("should set the errors in the session and redirect to the register when there is an exception on the register", async () => {
        serviceMock.save.mockImplementationOnce(() => {
            throw Error("ejemplo");
        });

        const redirectMock = jest.fn();
        const req = { params: { id: 1 }, session: { errors: {} } };
        await controller.register(req, { redirect: redirectMock });

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(req.session.errors).not.toEqual([]);
    });
});
