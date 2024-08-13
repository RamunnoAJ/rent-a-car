const User = require("../../entity/User");

module.exports = function createTestUser(id) {
    return new User(
        id,
        "johndoe@gmail.com",
        "token",
        "+54 12389543",
        "Marcos Peralta",
        "Argentina",
        "Av. 9 de Julio 1000",
        "213687436",
        "User"
    );
};
