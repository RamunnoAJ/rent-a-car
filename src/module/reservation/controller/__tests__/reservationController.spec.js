const Reservation = require("../../entity/Reservation");
const { fromDataToEntity } = require("../../mapper/reservationMapper");
const ReservationController = require("../reservationController");

describe("reservationController", () => {
    const serviceMock = {
        save: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn()
    };

    const carServiceMock = {
        getAll: jest.fn(),
        getById: jest.fn()
    };

    const userServiceMock = {
        getAll: jest.fn(),
        getById: jest.fn()
    };

    const controller = new ReservationController(
        serviceMock,
        carServiceMock,
        userServiceMock
    );

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
        expect(renderMock).toHaveBeenCalledWith("reservation/view/index.html", {
            data: { reservations: undefined },
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
        expect(res.render).toHaveBeenCalledWith(
            "reservation/view/create.html",
            { data: { cars: undefined, users: undefined } }
        );
        expect(req.session.messages).toEqual([]);
        expect(req.session.errors).toEqual([]);
    });

    it("should redirect to '/reservations' if there is an error trying to render createForm", async () => {
        carServiceMock.getAll.mockImplementationOnce(() => {
            throw Error();
        });

        const redirectMock = jest.fn();
        const req = { session: { errors: {} } };
        const res = {
            render: jest.fn(),
            redirect: redirectMock
        };
        await controller.createForm(req, res);

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(req.session.errors).not.toEqual([]);
    });

    it("should save a reservation when there is no id", async () => {
        serviceMock.save.mockReset();
        userServiceMock.getById.mockReset();
        carServiceMock.getById.mockReset();

        const redirectMock = jest.fn();
        const bodyMock = {
            id: null,
            "from-date": "2024-08-06T15:00",
            "to-date": "2024-08-09T15:00",
            days: 3,
            "baby-chair": 1,
            "snow-chain": 1,
            "payment-method": "Cash",
            "total-price": 3000,
            car: 1,
            user: 1
        };

        userServiceMock.getById.mockResolvedValue({ id: 1, name: "User 1" });
        carServiceMock.getById.mockResolvedValue({
            id: 1,
            model: "Car 1",
            price: 1000
        });

        await controller.save(
            { body: bodyMock, session: {} },
            { redirect: redirectMock }
        );

        expect(serviceMock.save).toHaveBeenCalledTimes(1);
        expect(serviceMock.save).toHaveBeenCalledWith(
            new Reservation(
                null,
                "2024-08-06T15:00",
                "2024-08-09T15:00",
                3,
                1,
                1,
                "Cash",
                43000,
                null,
                null,
                { id: 1, model: "Car 1", price: 1000 },
                { id: 1, name: "User 1" }
            )
        );
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith("/reservations");
    });

    it("should set the errors in the session and redirect to reservations when there is an exception on the save method", async () => {
        serviceMock.save.mockImplementationOnce(() => {
            throw Error();
        });

        const redirectMock = jest.fn();
        const req = { params: { id: 1 }, session: { errors: {} } };
        await controller.save(req, { redirect: redirectMock });

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(req.session.errors).not.toEqual([]);
    });

    it("should call the service to delete with the id passed and redirect to '/reservations'", async () => {
        const FAKE_reservation = new Reservation(1);
        serviceMock.getById.mockImplementationOnce(() =>
            Promise.resolve(FAKE_reservation)
        );
        const redirectMock = jest.fn();

        await controller.delete(
            { params: { id: 1 }, session: { user: { id: 2 } } },
            { redirect: redirectMock }
        );

        expect(serviceMock.delete).toHaveBeenCalledTimes(1);
        expect(serviceMock.delete).toHaveBeenCalledWith(FAKE_reservation);
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith("/reservations");
    });

    it("should set the errors in the session and redirect to the reservations index when there is an exception on the delete method", async () => {
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

        const reservationMock = new Reservation(1);
        serviceMock.getById.mockResolvedValue(reservationMock);

        await controller.editForm(req, res);

        expect(serviceMock.getById).toHaveBeenCalledWith(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith("reservation/view/edit.html", {
            data: {
                reservation: reservationMock,
                cars: undefined,
                users: undefined
            },
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
