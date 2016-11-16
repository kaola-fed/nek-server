const express = require('express');
const mongoose = require('mongoose');

const page = express.Router();

page.get('/', (req, res, next) => {
  res.json({ test: 0 });
});

module.exports = page;
