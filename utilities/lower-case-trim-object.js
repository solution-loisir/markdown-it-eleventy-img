const propertiesFrom = sourceObject => {
  const _sourceKeys = Object.keys(sourceObject);
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
        newObject[key] = sourceObject[_sourceKeys[index]];
        return newObject;
      }, {});
    }
  };
};

module.exports = {
  propertiesFrom
};