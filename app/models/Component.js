const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const componentSchema = new Schema({
  id: Number,
  name: { type: String, required: true }, // 组件名
  desc: String, // 描述
  cols: { type: Number, default: 1 }, // 占栅格数
  conf: [{
    key: String, // 属性名
    value: { type: String, default: '' }, // 属性值
    desc: String, // 属性描述
    // 属性类型，用于配置页和生成页
    // none: 配置页(checkbox) 生成页(attr)
    // string: 配置页(input-text) 生成页(attr="xx")
    // number: 配置页(input-number) 生成页(attr=3)
    // boolean: 配置页(checkbox) 生成页(attr=true)
    // select: 配置页(select) 生成页(attr="selected")
    // array: 配置页(checkbox-group) 生成页(attr={arr})
    // expression: 配置页(input-text) 生成页(attr={exp})
    type: { type: String, default: 'string' },
    // 只有在 type 是 select/array 的时候才有意义
    selects: [String],
    // string/number
    selectType: { type: String, default: 'string' },
    // string/number/boolean
    arrayType: { type: String, default: 'string' },
  }],
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  category: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
}, { timestamps: true, versionKey: false });

componentSchema.statics = {
  async upsert(_id, project, data) {
    _id = _id || new mongoose.Types.ObjectId;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;
    return await this.update(
      { _id, project },
      JSON.parse(JSON.stringify(data || {})),
      { upsert: true });
  },

  async getList(project, category) {
    return await this.find({ project, category });
  },
};

mongoose.model('Component', componentSchema);
