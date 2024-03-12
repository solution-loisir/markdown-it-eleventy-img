/** @typedef {require("../types.js").TokenAttributesObject} TokenAttributesObject */
/**
 * @param {MarkdownItToken} token The MarkdownIt token.
 * @returns {TokenAttributesObject}
 */
function generateAttrsObject(token) {

  let attrs = token.attrs.reduce((obj, current) => {
    const trimmedLowerCasedKey = current[0].toLowerCase().trim();
    obj[trimmedLowerCasedKey] = current[1];
    return obj;
  }, {});

  attrs["alt"] = token.content;

  return attrs;
}

module.exports = {
  generateAttrsObject
};