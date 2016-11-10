const express = require('express');
const app = express();

app.use('/', express.static('dist'));

app.listen(3300, function () {
  console.log('Listening on port 3300!');
});