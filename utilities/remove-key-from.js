/** @typedef {require("../types.js").TokenAttributesObject} TokenAttributesObject */
/** 
 * @typedef {function} From `FromObject`'s method
 * @param {TokenAttributesObject} source An object of token attributes
 * @returns {TokenAttributesObject} An object without the `excludeValue` property
 */
/**
 * @typedef {object} FromObject `remove`'s returned object. Contains the `from` method.
 * @property {From} from
 */

/**
 * Removes matching property to `excludeValue` from a provided `source` obbject. Returns an object containing the `from` method which takes the `source` object as argument. If `excludeValue` does _not_ exist, it returns the `source` object. If `excludeValue` does exist, it returns a new object without `excludeValue`.
 * @param {string} excludeValue The property to exclude from `source`
 * @example remove("propname").from(source);
 * @returns {FromObject} An object contaning the `from` method.
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