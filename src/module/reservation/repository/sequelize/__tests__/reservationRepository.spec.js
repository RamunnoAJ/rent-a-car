const createTestReservation = require("../../../controller/__tests__/reservation.fixture");
const ReservationRepository = require("../reservationRepository");
const ReservationIdNotDefinedError = require("../../error/reservationIdNotDefinedError");
const ReservationNotDefinedError = require("../../error/reservationNotDefinedError");
const { Sequelize } = require("sequelize");
const reservationModel = require("../../../model/reservationModel");
const ReservationNotFoundError = require("../../error/reservationNotFoundError");
const carModel = require("../../../../cars/model/carModel");
const userModel = require("../../../../user/model/userModel");

describe("reservationRepository", () => {
    /** @type {Sequelize} */
    let sequelize;
    /** @type {ReservationRepository} */
    let reservationRepository;
    /** @type {reservationModel} */
    let ReservationModel;

    beforeEach(done => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        });
        ReservationModel = reservationModel.setup(sequelize);
        carModel.setup(sequelize);
        userModel.setup(sequelize);
        ReservationModel.setupAssociations(carModel, userModel);
        reservationRepository = new ReservationRepository(ReservationModel);
        sequelize.sync({ force: true }).then(() => done());
    });

    it("should return a new id after saving a new reservation", async () => {
        const reservationWithoutId = createTestReservation();
        const { id, totalPrice, paymentMethod } =
            await reservationRepository.save(reservationWithoutId);
        expect(id).toEqual(1);
        expect(totalPrice).toEqual(3000);
        expect(paymentMethod).toEqual("Cash");
    });

    it("should update the fields of an existing reservation", async () => {
        const reservationWithoutId = createTestReservation();
        const reservationWithId = createTestReservation(1);

        reservationWithId.totalPrice = 4000;
        reservationWithId.paymentMethod = "Debit";

        const newReservation =
            await reservationRepository.save(reservationWithoutId);
        const newReservationTwo =
            await reservationRepository.save(reservationWithoutId);
        expect(newReservation.id).toEqual(1);
        expect(newReservationTwo.id).toEqual(2);

        const updatedReservation =
            await reservationRepository.save(reservationWithId);
        expect(updatedReservation.id).toEqual(1);
        expect(updatedReservation.totalPrice).toEqual(4000);
        expect(updatedReservation.paymentMethod).toEqual("Debit");
    });

    it("should throw an error when no reservation is passed", async () => {
        expect(await reservationRepository.save).rejects.toThrow(
            ReservationNotDefinedError
        );
    });

    it("should return the right reservation when searching by id", async () => {
        const reservationWithoutId = createTestReservation();
        await reservationRepository.save(reservationWithoutId);

        const reservation = await reservationRepository.getById(1);
        expect(reservation.id).toEqual(1);
        expect(reservation.totalPrice).toEqual(3000);
        expect(reservation.paymentMethod).toEqual("Cash");
    });

    it("should throw an error when searching for a reservation by id that doesn't exist", async () => {
        await expect(() => reservationRepository.getById(1)).rejects.toThrow(
            ReservationNotFoundError
        );
    });

    it("should throw an error when searching for a reservation without an id", async () => {
        await expect(reservationRepository.getById).rejects.toThrow(
            ReservationIdNotDefinedError
        );
    });

    it("should return an array of reservation when searching all", async () => {
        const reservationWithoutId = createTestReservation();
        await reservationRepository.save(reservationWithoutId);
        await reservationRepository.save(reservationWithoutId);
        await reservationRepository.save(reservationWithoutId);

        const reservations = await reservationRepository.getAll();
        expect(reservations).toHaveLength(3);
        expect(reservations[0].id).toEqual(1);
        expect(reservations[1].id).toEqual(2);
        expect(reservations[2].id).toEqual(3);
    });

    it("should return true when deleting a reservation", async () => {
        const reservationWithoutId = createTestReservation();
        const reservation =
            await reservationRepository.save(reservationWithoutId);

        let reservations = await reservationRepository.getAll();

        expect(reservations).toHaveLength(1);
        const deletedReservation = reservationRepository.delete(reservation);
        expect(deletedReservation).toBeTruthy();

        reservations = await reservationRepository.getAll();
        expect(reservations).toHaveLength(0);
    });

    it("should return false deleting a reservation that not exists", async () => {
        const reservationWithoutId = createTestReservation();
        await reservationRepository.save(reservationWithoutId);
        await reservationRepository.save(reservationWithoutId);

        const reservationThree = createTestReservation(3);
        const deletedreservation =
            await reservationRepository.delete(reservationThree);
        expect(deletedreservation).toBeFalsy();
    });

    it("should throw an error when deleting a reservation that is not an instance of the User entity", async () => {
        const reservation = { id: 1 };
        await expect(reservationRepository.delete(reservation)).rejects.toThrow(
            ReservationNotDefinedError
        );
    });
});
