const Image = require("@11ty/eleventy-img");
const logWarningFor = require("./utilities/warnings");
const { remove } = require("./utilities/remove-key-from");
const generateAttrsObject = require("./utilities/generate-attrs-object");
const { typeObjectError, typeFunctionError } = require("./utilities/errors");
const { propertiesFrom } = require("./utilities/lower-case-trim-object");

const fs = require("fs");
const path = require("path");


module.exports = function markdownItEleventyImg(md, {
  imgOptions = {},
  globalAttributes = {},
  renderImage
} = {}) {
  typeObjectError(imgOptions, "imgOptions");
  typeObjectError(globalAttributes, "globalAttributes");
  typeFunctionError(renderImage, "renderImage");

  const normalizedGlobalAttributes = propertiesFrom(globalAttributes).lowerCased().trimmed().object();

  logWarningFor(normalizedGlobalAttributes);

  md.renderer.rules.image  = (tokens, index, rendererOptions, env, renderer) => {

    const token = tokens[index];

    const normalizedTokenAttributes = generateAttrsObject(token).addContentTo("alt").attrs;

    const src = (fs.existsSync(normalizedTokenAttributes.src) || Image.Util.isRemoteUrl(normalizedTokenAttributes.src)) ? normalizedTokenAttributes.src : path.join(path.dirname(env.page.inputPath), normalizedTokenAttributes.src);

    const normalizedTokenAttributesWithoutSrc = remove("src").from(normalizedTokenAttributes);

    const imageAttributes = { ...normalizedGlobalAttributes, ...normalizedTokenAttributesWithoutSrc };

    if(renderImage) {
      const image = [ Image, imgOptions ];
      const attributes = [ src, imageAttributes ];
      return renderImage(image, attributes);
    }

    if(Image.Util.isRemoteUrl(src)) {
      token.attrs[token.attrIndex("alt")][1] = token.content;
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