const AbstractControllerError = require("./error/abstractControllerError");

module.exports = class AbstractController {
    constructor() {
        if (new.target === AbstractController) {
            throw new AbstractControllerError();
        }
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
     * @param {import("express")} app
     * @param {string} baseRoute
     * @param {Array<{ method: string, path: string, handler: Function }>} routes
     */
    configureSecureRoutes(app, baseRoute, routes) {
        routes.forEach(route => {
            app[route.method](
                `${baseRoute}${route.path}`,
                this.ensureAuthenticated.bind(this),
                route.handler.bind(this)
            );
        });
    }
};
