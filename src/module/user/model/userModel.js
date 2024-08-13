const { Model, DataTypes } = require("sequelize");

class UserModel extends Model {
    /** @param {import("sequelize").Sequelize} sequelizeInstance  */
    static setup(sequelizeInstance) {
        UserModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                token: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                nationality: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                driverLicense: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                role: {
                    type: DataTypes.ENUM("User", "Admin"),
                    allowNull: false
                }
            },
            {
                sequelize: sequelizeInstance,
                modelName: "User",
                tableName: "users",
                underscored: true,
                paranoid: true
            }
        );

        return UserModel;
    }
}

module.exports = UserModel;
