export default class TimelineService {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  getModel() {
    return this.dbAdapter.getModel('Timeline');
  }

  async create(data) {
    const model = this.getModel();
    const timeline = await model.create(data);
    timeline;
  }

  // 可单可多。
  async find(filter = {}) {
    const model = this.getModel();
    const timelines = await model.findAll({ where: filter });
    return timelines;
  }

  //
  async delete(id) {
    const model = this.getModel();
    const result = await model.destroy({ where: { id } });
    return result; 
  }
}