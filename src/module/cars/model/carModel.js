const { Model, DataTypes } = require("sequelize");

class CarModel extends Model {
    /** @param {import("sequelize").Sequelize} sequelizeInstance  */
    static setup(sequelizeInstance) {
        CarModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true
                },
                brand: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                model: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                year: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                kms: {
                    type: DataTypes.INTEGER
                },
                color: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                airConditioning: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                seats: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                transmission: {
                    type: DataTypes.ENUM(
                        "Automatic",
                        "Manual",
                        "Semi-Automatic"
                    ),
                    allowNull: false
                },
                price: {
                    type: DataTypes.FLOAT
                }
            },
            {
                sequelize: sequelizeInstance,
                modelName: "Car",
                tableName: "cars",
                underscored: true,
                paranoid: true
            }
        );

        return CarModel;
    }
}

module.exports = CarModel;
