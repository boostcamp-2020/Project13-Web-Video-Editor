export default string => {
  let hash = 0;
  let i;
  let chr;
  for (i = 0; i < string.length; i += 1) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit
  }
  return hash;
};
