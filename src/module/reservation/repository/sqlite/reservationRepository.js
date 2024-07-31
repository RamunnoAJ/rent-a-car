const AbstractReservationRepository = require("../abstractReservationRepository");
const ReservationNotFoundError = require("../error/reservationNotFoundError");
const { fromDbToEntity } = require("../../mapper/reservationMapper");

module.exports = class ReservationRepository extends (
    AbstractReservationRepository
) {
    /** @param {import("better-sqlite3").Database} databaseAdapater */
    constructor(databaseAdapater) {
        super();
        this.databaseAdapter = databaseAdapater;
    }

    /**
     * @param {import("../../entity/Reservation")} reservation
     * @returns {import("../../entity/Reservation")}
     */
    save(reservation) {
        let id;
        const isUpdate = reservation.id;

        if (isUpdate) {
            id = reservation.id;

            const statement = this.databaseAdapter.prepare(`
                UPDATE reservations SET
                    from_date = ?,
                    to_date = ?,
                    days = ?,
                    baby_chair = ?,
                    snow_chain = ?,
                    payment_method = ?,
                    total_price = ?,
                    fk_car_id = ?,
                    fk_user_id = ?
                WHERE id = ?
            `);

            const params = [
                reservation.fromDate,
                reservation.toDate,
                reservation.days,
                reservation.babyChair,
                reservation.snowChain,
                reservation.paymentMethod,
                reservation.totalPrice,
                reservation.carId,
                reservation.userId,
                reservation.id
            ];

            statement.run(params);
        } else {
            const statement = this.databaseAdapter.prepare(`
                INSERT INTO reservations(
                    from_date,
                    to_date,
                    days,
                    baby_chair,
                    snow_chain,
                    payment_method,
                    total_price,
                    fk_car_id,
                    fk_user_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const result = statement.run(
                reservation.fromDate,
                reservation.toDate,
                reservation.days,
                reservation.babyChair,
                reservation.snowChain,
                reservation.paymentMethod,
                reservation.totalPrice,
                reservation.carId,
                reservation.userId
            );

            id = result.lastInsertRowid;
        }

        return this.getById(id);
    }

    /**
     * @param {number} id
     * @returns {import("../../entity/Reservation")}
     */
    getById(id) {
        const reservation = this.databaseAdapter
            .prepare(
                `
            SELECT
                id,
                from_date,
                to_date,
                days,
                baby_chair,
                snow_chain,
                payment_method,
                total_price,
                fk_car_id,
                fk_user_id,
                created_at,
                updated_at
            FROM reservations WHERE id = ?
        `
            )
            .get(id);

        if (reservation === undefined) {
            throw new ReservationNotFoundError(
                `Couldn't find reservation with ID: ${id}`
            );
        }

        return fromDbToEntity(reservation);
    }

    /** @returns {Array<import("../../entity/Reservation")>} */
    getAll() {
        const reservations = this.databaseAdapter
            .prepare(
                `
                SELECT
                    id,
                    from_date,
                    to_date,
                    days,
                    baby_chair,
                    snow_chain,
                    payment_method,
                    total_price,
                    fk_car_id,
                    fk_user_id,
                    created_at,
                    updated_at
                FROM reservations
            `
            )
            .all();

        return reservations.map(reservation => fromDbToEntity(reservation));
    }

    /**
     * @param {import("../../entity/Reservation")} reservation
     * @returns {boolean}
     */
    delete(reservation) {
        if (!reservation || !reservation.id) {
            throw new ReservationNotFoundError();
        }

        this.databaseAdapter
            .prepare("DELETE FROM reservations WHERE id = ?")
            .run(reservation.id);

        return true;
    }
};
