import UserModelDefine from './user.model.define.js';
// import ProductModelDef from './Product.js';
// import OrderModelDef from './Order.js';
import TimelineModelDefine from './timeline.model.define.js';

export default function registerModels(sequelize) {
  const models = {};
  models.User = UserModelDefine(sequelize);
  // console.log('注册User模型:', models.User, models.User.options.hooks);
  models.Timeline = TimelineModelDefine(sequelize);
  return models;
}