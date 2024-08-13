require("dotenv").config();

module.exports = {
    development: {
        storage: process.env.DB_PATH,
        dialect: "sqlite"
    }
};
