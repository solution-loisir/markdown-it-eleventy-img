const findLazyFlag = require("./find-lazy-flag");

module.exports = token => {
  const tokenAttributes = token.attrs.reduce((acc, current) => {
    acc[current[0]] = current[1];
    return acc;
  }, {});

  tokenAttributes.alt = token.content;

  const title = tokenAttributes.title || "";

  const { isLazy, titleText } = findLazyFlag(title);

  if(titleText) {
    tokenAttributes.title = titleText;
  }
  
  if(isLazy) {
    tokenAttributes.loading = "lazy";
  }

  return tokenAttributes;
}