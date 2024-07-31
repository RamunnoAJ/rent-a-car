const Car = require("../../entity/Car");
const { fromDataToEntity } = require("../../mapper/carMapper");
const CarController = require("../carController");

describe("carController", () => {
    const serviceMock = {
        save: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn()
    };

    const controller = new CarController(serviceMock);

    it("Configure the routes correctly", () => {
        const app = {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn()
        };
        controller.configureRoutes(app);
    });

    it("index should render the index.html", async () => {
        const renderMock = jest.fn();

        await controller.index(
            { session: { errors: [], messages: [] } },
            { render: renderMock }
        );

        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith("cars/view/index.html", {
            data: { cars: undefined },
            errors: [],
            messages: []
        });
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
        expect(res.render).toHaveBeenCalledWith("cars/view/create.html");
        expect(req.session.messages).toEqual([]);
        expect(req.session.errors).toEqual([]);
    });

    it("should save a car when there is no id", async () => {
        serviceMock.save.mockReset();
        const redirectMock = jest.fn();
        const bodyMock = new Car(
            null,
            "brand",
            "model",
            "year",
            0,
            "color",
            undefined,
            4,
            "Automatic",
            150000
        );

        await controller.save(
            { body: bodyMock, session: {} },
            { redirect: redirectMock }
        );

        expect(serviceMock.save).toHaveBeenCalledTimes(1);
        expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith("/cars");
    });

    it("should set the errors in the session and redirect to cars when there is an exception on the save method", async () => {
        serviceMock.save.mockImplementationOnce(() => {
            throw Error();
        });

        const redirectMock = jest.fn();
        const req = { params: { id: 1 }, session: { errors: {} } };
        await controller.save(req, { redirect: redirectMock });

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(req.session.errors).not.toEqual([]);
    });

    it("should call the service to delete with the id passed and redirect to '/cars'", async () => {
        const FAKE_CAR = new Car(1);
        serviceMock.getById.mockImplementationOnce(() =>
            Promise.resolve(FAKE_CAR)
        );
        const redirectMock = jest.fn();

        await controller.delete(
            { params: { id: 1 }, session: { user: { id: 2 } } },
            { redirect: redirectMock }
        );

        expect(serviceMock.delete).toHaveBeenCalledTimes(1);
        expect(serviceMock.delete).toHaveBeenCalledWith(FAKE_CAR);
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith("/cars");
    });

    it("should set the errors in the session and redirect to the cars index when there is an exception on the delete method", async () => {
        serviceMock.delete.mockImplementationOnce(() => {
            throw Error();
        });

        const redirectMock = jest.fn();
        const req = { params: { id: 1 }, session: { errors: {} } };
        await controller.delete(req, { redirect: redirectMock });

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

        const carMock = new Car(1);
        serviceMock.getById.mockResolvedValue(carMock);

        await controller.editForm(req, res);

        expect(serviceMock.getById).toHaveBeenCalledWith(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith("cars/view/edit.html", {
            data: { car: carMock },
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
});
