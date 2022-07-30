module.exports = (exclude = "", source = {}) => {
  if(!source[exclude]) return source;

  return Object.keys(source).filter(key => key !== exclude).reduce((acc, current) => {
    acc[current] = source[current];
    return acc;
  }, {});
}