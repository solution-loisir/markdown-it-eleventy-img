module.exports = token => {
  const tokenAttributes = token.attrs.reduce((acc, current) => {
    const trimmedLowerCasedKey = current[0].toLowerCase().trim();
    acc[trimmedLowerCasedKey] = current[1];
    return acc;
  }, {});

  return {
    attrs: tokenAttributes,
    addContentTo(key = "") {
      this.attrs[key] = token.content;
      return this;
    }
  };
};