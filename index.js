const Image = require("@11ty/eleventy-img");
const logWarningFor = require("./utilities/warnings");
const removeKeyFrom = require("./utilities/remove-key-from");
const generateAttrsObject = require("./utilities/generate-attrs-object");


module.exports = function markdownItEleventyImg(md, {
  options = {},
  attributes = {}
} = {}) {

  logWarningFor(attributes);

  md.renderer.rules.image  = (tokens, index, rendererOptions, env, renderer) => {

    const token = tokens[index];

    const tokenAttributes = generateAttrsObject(token);

    const src = tokenAttributes.src;

    const tokenAttributesNoSrc = removeKeyFrom("src", tokenAttributes);

    const configAttributesNoTitle = removeKeyFrom("title", attributes);

    const imageAttributes = { ...configAttributesNoTitle, ...tokenAttributesNoSrc }
    
    Image(src, options);

    const metadata = Image.statsSync(src, options);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
    
    return imageMarkup;
  }
}