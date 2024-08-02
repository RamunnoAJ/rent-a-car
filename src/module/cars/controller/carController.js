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

        /** @type {Array<{method: string, path: string, handler: Function}>} */
        const secureRoutes = [
            { method: "get", path: "", handler: this.index },
            { method: "get", path: "create", handler: this.createForm },
            { method: "post", path: "/save", handler: this.save },
            { method: "delete", path: "/delete/:id", handler: this.delete },
            { method: "get", path: "/edit/:id", handler: this.editForm },
            { method: "get", path: "/view/:id", handler: this.view }
        ];

        this.configureSecureRoutes(app, BASE_ROUTE, secureRoutes);
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
     */
    async view(req, res) {
        try {
            const { id } = req.params;
            const { errors, messages } = req.session;
            const car = await this.carService.getById(id);
            res.render("cars/view/view.html", {
                data: { car },
                errors,
                messages
            });
        } catch (e) {
            res.redirect("/");
        }

        req.session.errors = [];
        req.session.messages = [];
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
    async editForm(req, res) {
        try {
            const { id } = req.params;
            const car = await this.carService.getById(id);

            const { errors, messages } = req.session;
            res.render("cars/view/edit.html", {
                data: { car },
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
            const car = fromDataToEntity(req.body);
            const savedCar = await this.carService.save(car);

            req.session.messages = [
                `Car with ID:${savedCar.id} saved correctly`
            ];
        } catch (e) {
            req.session.errors = ["Couldn't save the car"];
        }

        res.redirect("/cars");
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const car = await this.carService.getById(id);
            await this.carService.delete(car);

            req.session.messages = [`Car with ID: ${id} deleted correctly`];
        } catch (e) {
            req.session.errors = [
                e.message,
                "Couldn't delete the car correctly"
            ];
        }

        res.redirect("/cars");
    }
};
