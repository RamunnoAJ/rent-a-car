const Reservation = require("../entity/Reservation");
const ReservationNotDefinedError = require("./error/reservationNotDefinedError");
const ReservationIdNotDefinedError = require("./error/reservationIdNotDefinedError");

module.exports = class ReservationService {
    /**
     * @param {import("../repository/abstractReservationRepository")} reservationRepository
     */
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    /**
     * @param {Reservation} reservation
     */
    async save(reservation) {
        if (reservation === undefined) {
            throw new ReservationNotDefinedError();
        }

        return this.reservationRepository.save(reservation);
    }

    /**
     * @param {number} id
     */
    async getById(id) {
        if (id === undefined) {
            throw new ReservationIdNotDefinedError();
        }

        return this.reservationRepository.getById(id);
    }

    async getAll() {
        return this.reservationRepository.getAll();
    }

    /**
     * @param {Reservation} reservation
     */
    async delete(reservation) {
        if (reservation === undefined) {
            throw new ReservationNotDefinedError();
        }

        return await this.reservationRepository.delete(reservation);
    }
};
