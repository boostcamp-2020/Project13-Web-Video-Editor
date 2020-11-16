const { merge: mergeProd } = require('webpack-merge');
const commonProd = require('./webpack.common.ts');

module.exports = mergeProd(commonProd, {
  mode: 'production',
});
