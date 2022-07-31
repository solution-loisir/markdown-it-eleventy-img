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

  md.renderer.rules.image  = (tokens, index, options, env, self) => {

    const token = tokens[index];

    const tokenAttributes = generateAttrsObject(token);

    if(renderImage) return renderImage(Image, tokenAttributes);

    const src = tokenAttributes.src;

    const tokenAttributesNoSrc = removeKeyFrom("src", tokenAttributes);

    const configAttributesNoTitle = removeKeyFrom("title", globalAttributes);

    const imageAttributes = { ...configAttributesNoTitle, ...tokenAttributesNoSrc }
    
    Image(src, imgOptions);

    const metadata = Image.statsSync(src, imgOptions);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
    
    return imageMarkup;
  }
}