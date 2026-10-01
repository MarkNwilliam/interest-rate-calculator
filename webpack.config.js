'use strict';

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './script.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: false,
  performance: {
    hints: false,
  },
};