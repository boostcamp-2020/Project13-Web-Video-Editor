const { merge: mergeDev } = require('webpack-merge');
const commonDev = require('./webpack.common.ts');

module.exports = mergeDev(commonDev, {
  mode: 'development',
  devServer: {
    port: 8080,
    historyApiFallback: true,
  },
});
