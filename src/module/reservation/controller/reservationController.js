const AbstractController = require("../../abstractController");
const { fromDataToEntity } = require("../mapper/reservationMapper");

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

module.exports = class ReservationController extends AbstractController {
    /**
     * @param {import("../service/reservationService")} reservationService
     * @param {import("../../cars/service/carService")} carService
     * @param {import("../../user/service/userService")} userService
     */
    constructor(reservationService, carService, userService) {
        super();
        this.ROUTE_BASE = "/reservations";
        this.reservationService = reservationService;
        this.carService = carService;
        this.userService = userService;
    }

    /** @param {import("express")} app*/
    configureRoutes(app) {
        const BASE_ROUTE = this.ROUTE_BASE;

        /** @type {Array<{method: string, path: string, handler: Function}>} */
        const secureRoutes = [
            { method: "get", path: "", handler: this.index },
            { method: "get", path: "/create", handler: this.createForm },
            { method: "post", path: "/save", handler: this.save },
            { method: "delete", path: "/delete/:id", handler: this.delete },
            { method: "get", path: "/edit/:id", handler: this.editForm }
        ];

        this.configureSecureRoutes(app, BASE_ROUTE, secureRoutes);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async index(req, res) {
        const { errors, messages } = req.session;
        const reservations = await this.reservationService.getAll();
        res.render("reservation/view/index.html", {
            data: { reservations },
            errors,
            messages
        });

        req.session.errors = [];
        req.session.messages = [];
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async createForm(req, res) {
        try {
            const cars = await this.carService.getAll();
            const users = await this.userService.getAll();

            res.render("reservation/view/create.html", {
                data: { cars, users }
            });
            req.session.messages = [];
            req.session.errors = [];
        } catch (e) {
            res.redirect("/reservations");

            req.session.errors = [
                "There was an error trying to render the create view"
            ];
        }
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async editForm(req, res) {
        try {
            const { id } = req.params;
            const reservation = await this.reservationService.getById(id);
            const cars = await this.carService.getAll();
            const users = await this.userService.getAll();

            const { errors, messages } = req.session;
            res.render("reservation/view/edit.html", {
                data: { reservation, cars, users },
                errors,
                messages
            });
        } catch (e) {
            res.redirect("/");
        }

        req.session.messages = [];
        req.session.errors = [];
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async save(req, res) {
        req.session.messages = [];
        req.session.errors = [];

        try {
            const user = await this.userService.getById(req.body.user);
            const car = await this.carService.getById(req.body.car);
            const reservation = fromDataToEntity({ ...req.body, user, car });
            reservation.getTotalPrice();

            const savedReservation =
                await this.reservationService.save(reservation);

            req.session.messages = [
                `Reservation with ID:${savedReservation.id} saved correctly`
            ];
        } catch (e) {
            req.session.errors = ["Couldn't save the reservation"];
        }

        res.redirect("/reservations");
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const reservation = await this.reservationService.getById(id);
            await this.reservationService.delete(reservation);

            req.session.messages = [
                `Reservation with ID: ${id} deleted correctly`
            ];
        } catch (e) {
            req.session.errors = [
                e.message,
                "Couldn't delete the reservation correctly"
            ];
        }

        res.redirect("/reservations");
    }
};
