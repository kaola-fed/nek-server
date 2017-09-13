var merge = require('webpack-merge')
var prodEnv = require('./client.prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
