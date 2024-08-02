const fs = require("fs");
const Sqlite3Database = require("better-sqlite3");
const ReservationRepository = require("../reservationRepository");
const Reservation = require("../../../entity/Reservation");
const ReservationNotFoundError = require("../../error/reservationNotFoundError");
const Car = require("../../../../cars/entity/Car");
const User = require("../../../../user/entity/User");

describe("reservationRepository", () => {
    let mockDb;

    const TEST_CAR = new Car(
        1,
        "Toyota",
        "Corolla",
        "2020",
        15000,
        "Blue",
        1,
        5,
        "Automatic",
        20000
    );
    const TEST_USER = new User(
        1,
        1,
        1,
        "user1@example.com",
        "token12345",
        "123-456-7890",
        "User One",
        "USA",
        "123 Main St",
        "DL123456",
        "admin"
    );

    beforeEach(() => {
        mockDb = new Sqlite3Database(":memory:");
        const migration = fs.readFileSync("./src/config/setup.sql", "utf-8");
        mockDb.exec(migration);
        mockDb.exec(`
                INSERT INTO users (email, token, phone, name, nationality, address, driver_license, role)
                VALUES
                ('user1@example.com', 'token12345', '123-456-7890', 'User One', 'USA', '123 Main St', 'DL123456', 'admin'),
                ('user2@example.com', 'token67890', '098-765-4321', 'User Two', 'Canada', '456 Elm St', 'DL789012', 'user');
            `);
        mockDb.exec(`
                INSERT INTO cars (brand, model, year, kms, color, air_conditioning, seats, transmission, price)
                VALUES
                ('Toyota', 'Corolla', '2020', 15000, 'Blue', 1, 5, 'Automatic', 20000),
                ('Honda', 'Civic', '2019', 30000, 'Red', 0, 5, 'Manual', 18000);
            `);
    });

    it("should return a new id after saving a new reservation", () => {
        const repository = new ReservationRepository(mockDb);
        const newReservation = new Reservation(
            null,
            "",
            "",
            0,
            0,
            0,
            "debit",
            1000,
            1,
            1,
            TEST_CAR,
            TEST_USER
        );

        const reservation = repository.save(newReservation);
        expect(reservation.id).toEqual(1);
    });

    it("should update the fields of an existing reservation", () => {
        const repository = new ReservationRepository(mockDb);
        let reservation = repository.save(
            new Reservation(
                null,
                "",
                "",
                0,
                0,
                0,
                "debit",
                1000,
                1,
                1,
                TEST_CAR,
                TEST_USER
            )
        );
        expect(reservation.id).toEqual(1);

        reservation = repository.save(
            new Reservation(
                1,
                "",
                "",
                0,
                0,
                0,
                "credit",
                1000,
                1,
                1,
                TEST_CAR,
                TEST_USER
            )
        );

        expect(reservation.id).toEqual(1);
        expect(reservation.paymentMethod).toEqual("credit");
    });

    it("should throw an error when saving a reservation that doesn't exist", () => {
        const repository = new ReservationRepository(mockDb);

        expect(() => {
            repository.save(
                new Reservation(
                    1,
                    "",
                    "",
                    0,
                    0,
                    0,
                    "debit",
                    1000,
                    1,
                    1,
                    TEST_CAR,
                    TEST_USER
                )
            );
        }).toThrow(ReservationNotFoundError);
    });

    it("should throw an error when searching for a reservation by id that doesn't exist", () => {
        const repository = new ReservationRepository(mockDb);

        expect(() => {
            repository.getById(1);
        }).toThrow(ReservationNotFoundError);
    });

    it("should return the right reservation when searching by id", () => {
        const repository = new ReservationRepository(mockDb);
        const newReservation = repository.save(
            new Reservation(
                null,
                "",
                "",
                0,
                0,
                0,
                "debit",
                1000,
                1,
                1,
                TEST_CAR,
                TEST_USER
            )
        );

        expect(newReservation.id).toEqual(1);

        const reservation = repository.getById(1);
        expect(reservation).toEqual(newReservation);
    });

    it("should return an array of reservations when searching all reservations", () => {
        const repository = new ReservationRepository(mockDb);
        const newReservation1 = repository.save(
            new Reservation(
                null,
                "",
                "",
                0,
                0,
                0,
                "debit",
                1000,
                1,
                1,
                TEST_CAR,
                TEST_USER
            )
        );

        const newReservation2 = repository.save(
            new Reservation(
                null,
                "",
                "",
                1,
                1,
                1,
                "credit",
                2000,
                2,
                2,
                TEST_CAR,
                TEST_USER
            )
        );

        expect(repository.getAll()).toEqual([newReservation1, newReservation2]);
    });

    it("should return true when deleting a reservation", () => {
        const repository = new ReservationRepository(mockDb);
        const newReservation = repository.save(
            new Reservation(
                null,
                "",
                "",
                0,
                0,
                0,
                "debit",
                1000,
                1,
                1,
                TEST_CAR,
                TEST_USER
            )
        );

        expect(newReservation.id).toEqual(1);

        const reservation = repository.delete(newReservation);
        expect(reservation).toEqual(true);
    });

    it("should throw an error when deleting a reservation that not exists", () => {
        const repository = new ReservationRepository(mockDb);
        const newReservation = new Reservation(
            null,
            "",
            "",
            0,
            0,
            0,
            "debit",
            1000,
            1,
            1,
            TEST_CAR,
            TEST_USER
        );

        expect(() => repository.delete(newReservation)).toThrow(
            ReservationNotFoundError
        );
    });
});
