const express = require('express');
const mongoose = require('mongoose');

const component = express.Router();

component.get('/', (req, res, next) => {
  res.json({ test: 0 });
});

module.exports = component;
