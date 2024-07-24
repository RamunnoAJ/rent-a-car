require("dotenv").config();
const express = require("express");
const nunjucks = require("nunjucks");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

nunjucks.configure("src/module", {
    autoescape: true,
    express: app
});

app.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`)
);
