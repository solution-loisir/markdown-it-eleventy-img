const Image = require("@11ty/eleventy-img");
const logWarningFor = require("./utilities/warnings");
const { remove } = require("./utilities/remove-key-from");
const generateAttrsObject = require("./utilities/generate-attrs-object");
const { typeObjectError, typeFunctionError } = require("./utilities/errors");
const { propertiesFrom } = require("./utilities/lower-case-trim-object");

/**
 * 
 * @param {MarkdownIt} md The markdown-it object
 * @param {*} imgOptions Overrides eleventy-img specific options.
 * @param {*} globalAttributes Adds attributes to the image output.
 * @param {Function} renderImage Lets you render custom markup and do almost everything you like with your markdown images.
 * @param {Function} resolvePath Function that will be used to resolve paths for images in markdown. Receives image path string and env as parameters. Default resolves to CWD.
 */

module.exports = function markdownItEleventyImg(md, {
  imgOptions = {},
  globalAttributes = {},
  renderImage,
  resolvePath
} = {}) {

  typeObjectError(imgOptions, "imgOptions");
  typeObjectError(globalAttributes, "globalAttributes");
  typeFunctionError(renderImage, "renderImage");
  typeFunctionError(resolvePath, "resolvePath");

  const normalizedGlobalAttributes = propertiesFrom(globalAttributes).lowerCased().trimmed().object();

  logWarningFor(normalizedGlobalAttributes);

  md.renderer.rules.image  = (tokens, index, rendererOptions, env, renderer) => {

    const token = tokens[index];

    // Passing remote sources through Markdown-it default renderer.
    if(Image.Util.isRemoteUrl(token.attrGet("src"))) {
      token.attrs[token.attrIndex("alt")][1] = token.content;
      return renderer.renderToken(tokens, index, rendererOptions);
    }

    const normalizedTokenAttributes = generateAttrsObject(token).addContentTo("alt").attrs;

    const src = (resolvePath) ? resolvePath(normalizedTokenAttributes.src, env) : normalizedTokenAttributes.src;

    const normalizedTokenAttributesWithoutSrc = remove("src").from(normalizedTokenAttributes);

    const imageAttributes = { ...normalizedGlobalAttributes, ...normalizedTokenAttributesWithoutSrc };

    if(renderImage) {
      const image = [ Image, imgOptions ];
      const attributes = [ src, imageAttributes ];
      return renderImage(image, attributes);
    }
    
    Image(src, imgOptions);

    const metadata = Image.statsSync(src, imgOptions);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
    
    return imageMarkup;
  };
};