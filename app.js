const express = require('express');
const app = express();

app.use('/static', express.static('dist'));

app.get('/', (req, res) => {
  res.send('Hello NEK!');
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});