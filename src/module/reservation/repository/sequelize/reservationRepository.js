const AbstractReservationRepository = require("../abstractReservationRepository");
const ReservationNotDefinedError = require("../error/reservationNotDefinedError");
const ReservationIdNotDefinedError = require("../error/reservationIdNotDefinedError");
const ReservationNotFoundError = require("../error/reservationNotFoundError");
const { fromModelToEntity } = require("../../mapper/reservationMapper");
const Reservation = require("../../entity/Reservation");

module.exports = class ReservationRepository extends (
    AbstractReservationRepository
) {
    /** @param {typeof import("../../model/reservationModel")} reservationModel */
    constructor(reservationModel) {
        super();
        this.reservationModel = reservationModel;
    }

    /**
     * @param {import("../../entity/Reservation")} reservation
     * @returns {import("../../entity/Reservation")}
     */
    async save(reservation) {
        if (!(reservation instanceof Reservation)) {
            throw new ReservationNotDefinedError();
        }

        const reservationInstance = this.reservationModel.build(reservation, {
            isNewRecord: !reservation.id
        });

        await reservationInstance.save();
        return fromModelToEntity(reservationInstance);
    }

    /**
     * @param {number} id
     * @returns {import("../../entity/Reservation")}
     */
    async getById(id) {
        if (!id) {
            throw new ReservationIdNotDefinedError();
        }

        const reservationInstance = await this.reservationModel.findByPk(id);
        if (!reservationInstance) {
            throw new ReservationNotFoundError();
        }

        return fromModelToEntity(reservationInstance);
    }

    /** @returns {Array<import("../../entity/Reservation")>} */
    async getAll() {
        const reservationsInstance = await this.reservationModel.findAll({
            where: { deletedAt: null }
        });
        return reservationsInstance.map(fromModelToEntity);
    }

    /**
     * @param {import("../../entity/Reservation")} reservation
     * @returns {boolean}
     */
    async delete(reservation) {
        if (!(reservation instanceof Reservation)) {
            throw new ReservationNotDefinedError();
        }

        return Boolean(
            await this.reservationModel.destroy({
                where: { id: reservation.id }
            })
        );
    }
};
