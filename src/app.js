require("dotenv").config();
const express = require("express");
const nunjucks = require("nunjucks");

const configureDI = require("./config/di");
const { init: initUserModule } = require("./module/user/user");
const { init: initCarModule } = require("./module/cars/cars");
const {
    init: initReservationModule
} = require("./module/reservation/reservation");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

nunjucks.configure("src/module", {
    autoescape: true,
    express: app
});

const container = configureDI();
app.use(container.get("Session"));

initUserModule(app, container);
initCarModule(app, container);
initReservationModule(app, container);

app.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`)
);
