module.exports = token => {
  const tokenAttributes = token.attrs.reduce((acc, current) => {
    acc[current[0]] = current[1];
    return acc;
  }, {});

  tokenAttributes.alt = token.content;

  return tokenAttributes;
}