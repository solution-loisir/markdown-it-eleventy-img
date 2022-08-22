const remove = (excludeValue = "") => ({
  from(source = {}) {
    if(!source[excludeValue]) return source;

    return Object.keys(source).filter(key => key !== excludeValue).reduce((acc, current) => {
      acc[current] = source[current];
      return acc;
    }, {});
  }
});

module.exports = {
  remove
};