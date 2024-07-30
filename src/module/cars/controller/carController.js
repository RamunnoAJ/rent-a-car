const AbstractController = require("../../abstractController");
const { fromDataToEntity } = require("../mapper/carMapper");

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

module.exports = class CarController extends AbstractController {
    /** @param {import("../service/carService")} carService */
    constructor(carService) {
        super();
        this.ROUTE_BASE = "/cars";
        this.carService = carService;
    }

    /** @param {import("express")} app*/
    configureRoutes(app) {
        const BASE_ROUTE = this.ROUTE_BASE;

        app.get(
            `${BASE_ROUTE}`,
            this.ensureAuthenticated.bind(this),
            this.index.bind(this)
        );
        app.get(
            `${BASE_ROUTE}/create`,
            this.ensureAuthenticated.bind(this),
            this.createForm.bind(this)
        );
        app.post(
            `${BASE_ROUTE}/save`,
            this.ensureAuthenticated.bind(this),
            this.save.bind(this)
        );
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async index(req, res) {
        const { errors, messages } = req.session;
        const cars = await this.carService.getAll();
        res.render("cars/view/index.html", {
            data: { cars },
            errors,
            messages
        });

        req.session.errors = [];
        req.session.messages = [];
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {Function} next
     */
    ensureAuthenticated(req, res, next) {
        if (req.session.user) {
            return next();
        }
        res.redirect("/auth/login");
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async createForm(req, res) {
        res.render("cars/view/create.html");

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
            const car = fromDataToEntity(req.body);
            const savedCar = await this.carService.save(car);

            req.session.messages = [
                `Car with ID:${savedCar.id} (${savedCar.name}) saved correctly`
            ];

            res.redirect("/cars");
        } catch (e) {
            req.session.errors = ["Couldn't save the car"];
            res.redirect("/cars");
        }
    }
};
