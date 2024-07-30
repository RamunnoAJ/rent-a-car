const AbstractController = require("../../abstractController");
const { fromDataToEntity } = require("../mapper/userMapper");
const UserCantDeleteHimselfError = require("./error/UserCantDeleteHimselfError");

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

module.exports = class UserController extends AbstractController {
    /** @param {import("../service/userService")} userService  */
    constructor(userService) {
        super();
        this.ROUTE_BASE = "/auth";
        this.ROUTE_USER = "/users";
        this.userService = userService;
    }

    /** @param {import("express")} app*/
    configureRoutes(app) {
        const BASE_ROUTE = this.ROUTE_BASE;
        const USER_ROUTE = this.ROUTE_USER;

        app.get(
            "/",
            this.ensureAuthenticated.bind(this),
            this.index.bind(this)
        );

        app.get(`${BASE_ROUTE}/register`, this.registerForm.bind(this));
        app.post(`${BASE_ROUTE}/register`, this.register.bind(this));
        app.get(`${BASE_ROUTE}/login`, this.loginForm.bind(this));
        app.post(`${BASE_ROUTE}/login`, this.login.bind(this));
        app.post(`${BASE_ROUTE}/logout`, this.logout.bind(this));

        app.delete(
            `${USER_ROUTE}/delete/:id`,
            this.ensureAuthenticated.bind(this),
            this.delete.bind(this)
        );
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async index(req, res) {
        const { errors, messages } = req.session;
        const users = await this.userService.getAll();
        res.render("user/view/index.html", {
            data: { users },
            errors,
            messages
        });
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
            res.redirect("/auth/login");
            req.session.messages = ["User created correctly"];
        } catch (e) {
            req.session.errors = [e.message, e.stack];
            res.redirect("/auth/register");
        }
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    loginForm(req, res) {
        const { errors, messages } = req.session;
        res.render("user/view/login.html", { errors, messages });
        req.session.messages = [];
        req.session.errors = [];
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.getByEmail(email);
            const isValid = await this.userService.comparePasswords(
                password,
                user.token
            );

            if (isValid) {
                req.session.user = user;
                res.redirect("/");
            } else {
                req.session.errors = ["Invalid email or password"];
                res.redirect("/auth/login");
            }
        } catch (e) {
            req.session.errors = ["Invalid email or password"];
            res.redirect("/auth/login");
        }
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.redirect("/");
            }
            res.redirect("/auth/login");
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (Number(id) === req.session.user.id) {
                throw new UserCantDeleteHimselfError(
                    "User can't delete himself"
                );
            }
            const user = await this.userService.getById(id);
            await this.userService.delete(user);

            req.session.messages = [
                `User with ID: ${id} (${user.name}) deleted correctly`
            ];
        } catch (e) {
            req.session.errors = [
                e.message,
                "Couldn't delete the user correctly"
            ];
        }

        res.redirect("/");
    }
};
