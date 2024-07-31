const User = require("../../entity/User");
const { fromDataToEntity } = require("../../mapper/userMapper");
const UserController = require("../userController");
const UserCantDeleteHimselfError = require("../error/UserCantDeleteHimselfError");

describe("userController", () => {
    const serviceMock = {
        save: jest.fn(),
        getById: jest.fn(),
        getByEmail: jest.fn(),
        getAll: jest.fn(),
        comparePasswords: jest.fn(),
        delete: jest.fn()
    };

    const controller = new UserController(serviceMock);

    it("Configure the routes correctly", () => {
        const app = {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn()
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
        expect(redirectMock).toHaveBeenCalledWith("/auth/login");
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
            errors: [],
            messages: []
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

    it("should logout the user and redirect to login", () => {
        const req = {
            session: {
                destroy: jest.fn(callback => callback(null))
            }
        };
        const res = {
            redirect: jest.fn()
        };

        controller.logout(req, res);

        expect(req.session.destroy).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    it("should handle errors during logout", () => {
        const req = {
            session: {
                destroy: jest.fn(callback =>
                    callback(new Error("Logout error"))
                )
            }
        };
        const res = {
            redirect: jest.fn()
        };

        controller.logout(req, res);

        expect(req.session.destroy).toHaveBeenCalledTimes(1);
        expect(req.session.destroy).toHaveBeenCalledWith(expect.any(Function));
        expect(res.redirect).toHaveBeenCalledWith("/");
    });

    it("index should render the index.html", async () => {
        const renderMock = jest.fn();

        await controller.index(
            { session: { errors: [], messages: [] } },
            { render: renderMock }
        );

        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith("user/view/index.html", {
            data: { users: undefined },
            errors: [],
            messages: []
        });
    });

    it("should call the service to delete with the id passed and redirect to '/'", async () => {
        const FAKE_USER = new User({ id: 1 });
        serviceMock.getById.mockImplementationOnce(() =>
            Promise.resolve(FAKE_USER)
        );
        const redirectMock = jest.fn();

        await controller.delete(
            { params: { id: 1 }, session: { user: { id: 2 } } },
            { redirect: redirectMock }
        );

        expect(serviceMock.delete).toHaveBeenCalledTimes(1);
        expect(serviceMock.delete).toHaveBeenCalledWith(FAKE_USER);
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith("/");
    });

    it("should call throw an error when user tries to delete himself", async () => {
        const FAKE_USER = new User({ id: 1 });
        serviceMock.getById.mockImplementationOnce(() =>
            Promise.resolve(FAKE_USER)
        );
        const redirectMock = jest.fn();

        await controller.delete(
            { params: { id: 1 }, session: { user: { id: 1 } } },
            { redirect: redirectMock }
        );

        expect(serviceMock.delete).toHaveBeenCalledTimes(1);
        expect(serviceMock.delete).toHaveBeenCalledWith(FAKE_USER);
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith("/");
    });

    it("should set the errors in the session and redirect to the register when there is an exception on the delete method", async () => {
        serviceMock.delete.mockImplementationOnce(() => {
            throw UserCantDeleteHimselfError();
        });

        const redirectMock = jest.fn();
        const req = { params: { id: 1 }, session: { errors: {} } };
        await controller.delete(req, { redirect: redirectMock });

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(req.session.errors).not.toEqual([]);
    });

    it("should save a user when there is no id", async () => {
        serviceMock.save.mockReset();
        const redirectMock = jest.fn();
        const bodyMock = new User(
            null,
            null,
            null,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "User"
        );

        await controller.save(
            { body: bodyMock, session: {} },
            { redirect: redirectMock }
        );

        expect(serviceMock.save).toHaveBeenCalledTimes(1);
        expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith("/");
    });

    it("should set the errors in the session and redirect to the home when there is an exception on the save method", async () => {
        serviceMock.save.mockImplementationOnce(() => {
            throw Error();
        });

        const redirectMock = jest.fn();
        const req = { params: { id: 1 }, session: { errors: {} } };
        await controller.save(req, { redirect: redirectMock });

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(req.session.errors).not.toEqual([]);
    });

    it("should render edit.html when calling editForm", async () => {
        const renderMock = jest.fn();
        const req = {
            params: { id: 1 },
            session: { errors: [], messages: [] }
        };
        const res = {
            render: renderMock
        };

        const userMock = new User({ id: 1 });
        serviceMock.getById.mockResolvedValue(userMock);

        await controller.editForm(req, res);

        expect(serviceMock.getById).toHaveBeenCalledWith(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith("user/view/edit.html", {
            data: { user: userMock },
            errors: [],
            messages: []
        });
        expect(req.session.messages).toEqual([]);
        expect(req.session.errors).toEqual([]);
    });

    it("editForm should handles exceptions", async () => {
        const req = {
            params: { id: 1 },
            session: { errors: [], messages: [] }
        };
        const res = {
            render: jest.fn(),
            redirect: jest.fn()
        };

        serviceMock.getById.mockImplementationOnce(() => {
            throw new Error("Error");
        });

        await controller.editForm(req, res);

        expect(serviceMock.getById).toHaveBeenCalledWith(1);
        expect(res.render).not.toHaveBeenCalled();
        expect(req.session.messages).toEqual([]);
        expect(req.session.errors).toEqual([]);
    });

    it("should render create.html when calling createForm", async () => {
        const req = {
            session: { errors: [], messages: [] }
        };
        const res = {
            render: jest.fn(),
            redirect: jest.fn()
        };

        await controller.createForm(req, res);

        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("user/view/create.html");
        expect(req.session.messages).toEqual([]);
        expect(req.session.errors).toEqual([]);
    });
});
