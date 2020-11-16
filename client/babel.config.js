module.exports = api => {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: '> 0.2%, not dead',
        useBuiltIns: 'usage',
        corejs: '3',
        modules: false,
      },
    ],
    ['@babel/preset-react'],
    ['@babel/preset-typescript'],
  ];

  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-transform-async-to-generator'],
    ['@babel/plugin-transform-runtime'],
  ];

  return {
    presets,
    plugins,
  };
};
