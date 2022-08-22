const Image = require("@11ty/eleventy-img");
const logWarningFor = require("./utilities/warnings");
const { remove } = require("./utilities/remove-key-from");
const generateAttrsObject = require("./utilities/generate-attrs-object");
const { typeObjectError, typeFunctionError } = require("./utilities/errors");


module.exports = function markdownItEleventyImg(md, {
  imgOptions = {},
  globalAttributes = {},
  renderImage
} = {}) {
  typeObjectError(imgOptions, "imgOptions");
  typeObjectError(globalAttributes, "globalAttributes");
  typeFunctionError(renderImage, "renderImage");

  logWarningFor(globalAttributes);

  md.renderer.rules.image  = (tokens, index, rendererOptions, env, renderer) => {

    const token = tokens[index];

    const tokenAttributes = generateAttrsObject(token).addContentTo("alt").attrs;

    const src = tokenAttributes.src;

    const tokenAttributesWithoutSrc = remove("src").from(tokenAttributes);

    const imageAttributes = { ...globalAttributes, ...tokenAttributesWithoutSrc };

    if(renderImage) {
      const image = [ Image, imgOptions ];
      const attributes = [ src, imageAttributes ];
      return renderImage(image, attributes);
    }

    if(Image.Util.isRemoteUrl(src)) {
      token.attrs[token.attrIndex('alt')][1] = tokenAttributes.alt;
      return renderer.renderToken(tokens, index, rendererOptions);
    }
    
    Image(src, imgOptions);

    const metadata = Image.statsSync(src, imgOptions);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
    
    return imageMarkup;
  };
};