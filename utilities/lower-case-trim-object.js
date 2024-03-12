/** @typedef {require("../types.js").GlobalAttributes} GlobalAttributes */
/**
 * Lower case and trim `sourceObject` properties.
 * @param {GlobalAttributes} sourceObject 
 * @returns {GlobalAttributes}
 */

const normalizingProperties = (sourceObject) => {
  const _sourceValues = Object.values(sourceObject);
  let _keys = Object.keys(sourceObject);

  _keys = _keys.map(key => key.toLowerCase().trim());

  return _keys.reduce((newObject, key, index) => {
    newObject[key] = _sourceValues[index];
    return newObject;
  }, {});
};

module.exports = {
  normalizingProperties
};