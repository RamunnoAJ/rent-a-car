const AbstractController = require("../../abstractController");
const { fromDataToEntity } = require("../mapper/userMapper");

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

module.exports = class UserController extends AbstractController {
    /** @param {import("../service/userService")} userService  */
    constructor(userService) {
        super();
        this.AUTH_ROUTE_BASE = "/auth";
        this.ROUTE_BASE = "/auth";
        this.userService = userService;
    }

    /** @param {import("express")} app*/
    configureRoutes(app) {
        const AUTH_ROUTE = this.AUTH_ROUTE_BASE;

        app.get(`${AUTH_ROUTE}/register`, this.registerForm.bind(this));
        app.post(`${AUTH_ROUTE}/register`, this.register.bind(this));
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    registerForm(req, res) {
        const { errors } = req.session;
        res.render("user/view/register.html", { errors });
        req.session.messages = [];
        req.session.errors = [];
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async register(req, res) {
        try {
            const user = fromDataToEntity(req.body);
            await this.userService.save(user);
            res.redirect(201, "/login");
            req.session.messages = ["User created correctly"];
        } catch (e) {
            req.session.errors = [e.message, e.stack];
            res.redirect("/auth/register");
        }
    }
};
