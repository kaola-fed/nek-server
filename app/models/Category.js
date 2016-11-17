const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  components: [{ type: Schema.Types.ObjectId, ref: 'Component' }],
});

categorySchema.statics = {
  async add(name) {
    const category = new this({ name });
    await category.save();
  }
};

mongoose.model('Category', categorySchema);
