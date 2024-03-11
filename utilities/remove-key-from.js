/** @typedef {require("../types.js").TokenAttributes} TokenAttributes */

/**
 * Removes matching property to `excludeValue` from a provided `source` obbject. Returns an object containing the `from` method which takes the `source` object as argument. If `excludeValue` does _not_ exist, it returns the `source` object. If `excludeValue` does exist, it returns a new object without `excludeValue`.
 * @param {string} excludeValue
 * @example remove("propname").from(sourceObj);
 * @returns {{ from(source: TokenAttributes): TokenAttributes }}
 */

const remove = (excludeValue) => ({
  from(source) {
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