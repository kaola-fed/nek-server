import mongoose from 'mongoose';

const schema = mongoose.Schema({
  username: String,
  email: String,
  projects: [{
    id: mongoose.Schema.ObjectId,
    name: String,
  }],
});

mongoose.model('User', schema);
