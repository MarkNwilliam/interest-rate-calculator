'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/script.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    // Copies the page and its assets so dist/ is fully self-contained and can be
    // served as-is. index.html is copied verbatim, so it keeps its own
    // <script src="script.js"> reference and that file is copied too.
    new CopyWebpackPlugin({
      patterns: [
        { from: 'index.html', to: 'index.html' },
        { from: 'style.css', to: 'style.css' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'script.js', to: 'script.js' },
      ],
    }),
  ],
  devtool: false,
  performance: {
    hints: false,
  },
};