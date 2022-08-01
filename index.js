const Image = require("@11ty/eleventy-img");
const logWarningFor = require("./utilities/warnings");
const removeKeyFrom = require("./utilities/remove-key-from");
const generateAttrsObject = require("./utilities/generate-attrs-object");


module.exports = function markdownItEleventyImg(md, {
  imgOptions = {},
  globalAttributes = {},
  renderImage
} = {}) {

  logWarningFor(globalAttributes);

  md.renderer.rules.image  = (tokens, index, rendererOptions, env, renderer) => {

    const token = tokens[index];

    const tokenAttributes = generateAttrsObject(token);

    const src = tokenAttributes.src;

    const tokenAttributesNoSrc = removeKeyFrom("src", tokenAttributes);

    const configAttributesNoTitle = removeKeyFrom("title", globalAttributes);

    const imageAttributes = { ...configAttributesNoTitle, ...tokenAttributesNoSrc }

    if(renderImage) {
      const image = [ Image, imgOptions ];
      const attributes = [ imageAttributes, src ];
      return renderImage(image, attributes);
    }
    
    Image(src, imgOptions);

    const metadata = Image.statsSync(src, imgOptions);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
    
    return imageMarkup;
  }
}