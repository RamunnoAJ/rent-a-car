const AbstractCarRepository = require("../abstractCarRepository");
const CarIdNotDefinedError = require("../error/carIdNotDefinedError");
const CarNotFoundError = require("../error/carNotFoundError");
const CarNotDefinedError = require("../error/carNotDefinedError");
const { fromModelToEntity } = require("../../mapper/carMapper");
const Car = require("../../entity/Car");

module.exports = class CarRepository extends AbstractCarRepository {
    /** @param {typeof import("../../model/carModel")} carModel */
    constructor(carModel) {
        super();
        this.carModel = carModel;
    }

    /**
     * @param {import("../../entity/Car")} car
     * @returns {import("../../entity/Car")}
     */
    async save(car) {
        if (!(car instanceof Car)) {
            throw new CarNotDefinedError();
        }

        const carInstance = this.carModel.build(car, {
            isNewRecord: !car.id
        });

        await carInstance.save();
        return fromModelToEntity(carInstance);
    }

    /**
     * @param {number} id
     * @returns {import("../../entity/Car")}
     */
    async getById(id) {
        if (!Number(id)) {
            throw new CarIdNotDefinedError();
        }

        const carInstance = await this.carModel.findByPk(id);
        if (!carInstance) {
            throw new CarNotFoundError();
        }

        return fromModelToEntity(carInstance);
    }

    /** @returns {Array<import("../../entity/Car")>} */
    async getAll() {
        const carsInstance = await this.carModel.findAll({
            where: { deletedAt: null }
        });
        return carsInstance.map(fromModelToEntity);
    }

    /**
     * @param {import("../../entity/Car")} car
     * @returns {boolean}
     */
    async delete(car) {
        if (!(car instanceof Car)) {
            throw new CarNotDefinedError();
        }

        return Boolean(await this.carModel.destroy({ where: { id: car.id } }));
    }
};
