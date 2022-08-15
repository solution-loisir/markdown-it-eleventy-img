module.exports = token => {
  const tokenAttributes = token.attrs.reduce((acc, current) => {
    acc[current[0]] = current[1];
    return acc;
  }, {});

  return {
    attrs: tokenAttributes,
    addContentTo(key = "") {
      this.attrs[key] = token.content;
      return this;
    }
  };
}