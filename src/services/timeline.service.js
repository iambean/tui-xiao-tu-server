export default class TimelineService {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  #getModel() {
    return this.dbAdapter.getModel('Timeline');
  }

  //---------------the following read methods are used by controller----------------//
  // 可单可多。
  async find(filter = {}) {
    const model = this.#getModel();
    return await model.findAll({ where: filter });
  }

  async findOne(id) {
    const model = this.#getModel();
    return await model.findByPk(id);
  }

  //---------------the following write methods are used by crawler----------------//
  async __saveOne(data) {
    const model = this.#getModel();
    return await model.upsert(data);
  }

  async __saveMany(data) {
    const model = this.#getModel();
    return await model.bulkCreate(data, { updateOnDuplicate: true });
  }

  async __deleteOne(id) {
    const model = this.#getModel();
    return await model.destroy({ where: { id } });
  }

  async __delete(idList) {
    const model = this.#getModel();
    return await model.destroy({ where: { id: { [Op.in]: idList } } });
  }

  async __cleanDataset() {
    const model = this.#getModel();
    return await model.destroy({ where: {} });
  }
}
