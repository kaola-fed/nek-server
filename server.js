const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();

const config = require('./config');

const storage = require('multer-gridfs-storage')({ url: config.db });
const upload = multer({ storage });

const connect = () => {
  mongoose.connect(config.db, {
    server: { socketOptions: { keepAlive: 120 } }
  });
}, conn = mongoose.connection;
connect();
conn.on('error', console.error);
conn.on('disconnected', connect);
conn.on('open', () => {
  console.log(`Connected mongo: ${config.db}`);
});

fs.readdirSync(path.join(__dirname, 'app/models')).forEach((file) => {
  if (~file.indexOf('.js')) require(path.join(__dirname, 'app/models', file));
});

// Upload
app.post('/upload', upload.single('fileData'), (res, req) => {
  console.log(res);
  console.log(req);
});

config.express(app);
config.router(app);

// Error handle
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err) => {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const port = process.env.VCAP_APP_PORT || 3300;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});