const express = require('express');
const mongoose = require('mongoose');

const project = express.Router();

project.get('/', (req, res, next) => {
  res.json({ test: 0 });
});

module.exports = project;
