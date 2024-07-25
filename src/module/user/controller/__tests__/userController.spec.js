const { fromDataToEntity } = require("../../mapper/userMapper");
const UserController = require("../userController");

describe("userController", () => {
    const serviceMock = {
        save: jest.fn(),
        getByEmail: jest.fn(),
        comparePasswords: jest.fn()
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
        expect(redirectMock).toHaveBeenCalledWith(201, "/auth/login");
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

    it("loginForm renders login.html", () => {
        const renderMock = jest.fn();

        controller.loginForm(
            { session: { errors: [], messages: [] } },
            { render: renderMock }
        );

        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith("user/view/login.html", {
            errors: []
        });
    });

    it("should login successfully with valid credentials", async () => {
        const req = {
            body: { email: "test@example.com", password: "password" },
            session: {}
        };
        const res = {
            redirect: jest.fn()
        };

        const userMock = {
            id: 1,
            email: "test@example.com",
            token: "hashed_password"
        };
        serviceMock.getByEmail.mockResolvedValue(userMock);
        serviceMock.comparePasswords.mockResolvedValue(true);

        await controller.login(req, res);

        expect(serviceMock.getByEmail).toHaveBeenCalledWith("test@example.com");
        expect(serviceMock.comparePasswords).toHaveBeenCalledWith(
            "password",
            "hashed_password"
        );
        expect(req.session.user).toEqual(userMock);
        expect(res.redirect).toHaveBeenCalledWith("/");
    });

    it("should fail login with invalid credentials", async () => {
        const req = {
            body: { email: "test@example.com", password: "wrongpassword" },
            session: {}
        };
        const res = {
            redirect: jest.fn()
        };

        const userMock = {
            id: 1,
            email: "test@example.com",
            token: "hashed_password"
        };
        serviceMock.getByEmail.mockResolvedValue(userMock);
        serviceMock.comparePasswords.mockResolvedValue(false);

        await controller.login(req, res);

        expect(serviceMock.getByEmail).toHaveBeenCalledWith("test@example.com");
        expect(serviceMock.comparePasswords).toHaveBeenCalledWith(
            "wrongpassword",
            "hashed_password"
        );
        expect(req.session.errors).toEqual(["Invalid email or password"]);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    it("should handle exceptions during login", async () => {
        const req = {
            body: { email: "test@example.com", password: "password" },
            session: {}
        };
        const res = {
            redirect: jest.fn()
        };

        serviceMock.getByEmail.mockImplementationOnce(() => {
            throw new Error("User not found");
        });

        await controller.login(req, res);

        expect(serviceMock.getByEmail).toHaveBeenCalledWith("test@example.com");
        expect(req.session.errors).toEqual(["Invalid email or password"]);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });
});
