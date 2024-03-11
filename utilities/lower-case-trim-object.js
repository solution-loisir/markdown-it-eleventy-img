const propertiesFrom = sourceObject => {
  const _sourceValues = Object.values(sourceObject);
  let _keys = Object.keys(sourceObject);

  return {
    lowerCased() {
      _keys = _keys.map(key => key.toLowerCase());
      return this;
    },
    trimmed() {
      _keys = _keys.map(key => key.trim());
      return this;
    },
    object() {
      return _keys.reduce((newObject, key, index) => {
        newObject[key] = _sourceValues[index];
        return newObject;
      }, {});
    }
  };
};

module.exports = {
  propertiesFrom
};