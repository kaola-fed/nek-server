const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const componentSchema = new Schema({
  id: Number,
  name: String, // 组件名
  desc: String, // 描述
  cols: Number, // 占栅格数
  conf: [{
    key: String, // 属性名
    value: String, // 属性值
    desc: String, // 属性描述
    // 属性类型，用于配置页和生成页
    // none: 配置页(checkbox) 生成页(attr)
    // string: 配置页(input-text) 生成页(attr="xx")
    // number: 配置页(input-number) 生成页(attr=3)
    // boolean: 配置页(checkbox) 生成页(attr=true)
    // select: 配置页(select) 生成页(attr="selected")
    // array: 配置页(checkbox-group) 生成页(attr={arr})
    // expresion: 配置页(input-text) 生成页(attr={exp})
    type: String,
    // 只有在 type 是 select/array 的时候才有意义
    selects: [String],
  }],
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
});

mongoose.model('Module', componentSchema);
