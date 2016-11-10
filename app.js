const express = require('express');
const path = require('path');
const app = express();

app.use('/project', express.static(path.join(__dirname, 'public/projects')));

app.use('/', express.static('dist'));

app.listen(3300, function () {
  console.log('Listening on port 3300!');
});