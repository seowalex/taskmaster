const { environment } = require('@rails/webpacker');
const webpack = require('webpack');
const typescript = require('./loaders/typescript');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

environment.plugins.append('Provide', new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  Popper: ['popper.js', 'default'],
}));

environment.loaders.prepend('typescript', typescript);

environment.config.merge({
  resolve: {
    plugins: [
      new DirectoryNamedWebpackPlugin(true),
    ],
  },
});

module.exports = environment;
