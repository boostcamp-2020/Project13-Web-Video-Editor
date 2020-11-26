export default (reactStyle: object) =>
  Object.entries(reactStyle).reduce(
    (acc, [key, val]) =>
      `${acc}${key.replace(
        /([A-Z])/g,
        g => `-${g[0].toLowerCase()}`
      )}: ${val};\n`,
    ''
  );
