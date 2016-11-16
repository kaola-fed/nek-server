const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  components: [{ type: Schema.Types.ObjectId, ref: 'Component' }],
});

mongoose.model('Category', categorySchema);
