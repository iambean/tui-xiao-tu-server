export default class TimelineService {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  #getModel() {
    return this.dbAdapter.getModel('Timeline');
  }

  async create(data) {
    const model = this.#getModel();
    if (Array.isArray(data)) {
      return await model.bulkCreate(data);
    }
    return await model.create(data);
  }

  // 可单可多。
  async find(filter = {}) {
    const model = this.#getModel();
    return await model.findAll({ where: filter });
  }

  async findOne(id) {
    const model = this.#getModel();
    return await model.findByPk(id);
  }

  //
  async delete(id) {
    const model = this.#getModel();
    const where = Array.isArray(id) ? { id: { [Op.in]: id } } : { id };
    return await model.destroy({ where });
  }
}